import { useEffect, useState } from 'react';
import { Tabs, Table, Button, Space, Modal, Form, Input, InputNumber, Select, message } from 'antd';

export default function AdminDashboard() {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [vendorStatusFilter, setVendorStatusFilter] = useState('all');
  const [form] = Form.useForm();

  const token = localStorage.getItem('token');

  const fetchPending = async () => {
    const res = await fetch('/marketplace/admin/pending-products', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setPendingProducts(await res.json());
  };

  const fetchVendors = async () => {
    try {
      const res = await fetch('/api/admin/vendors', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load vendors');
      // Ensure _id is present for deletes
      const normalized = (Array.isArray(data) ? data : []).map(v => ({ ...v, _id: v._id || v.id }));
      setVendors(normalized);
    } catch (e) {
      message.error(e.message);
    }
  };

  const fetchAllProducts = async () => {
    const res = await fetch('/marketplace', {});
    if (res.ok) setAllProducts(await res.json());
  };

  useEffect(() => {
    fetchPending();
    fetchVendors();
    fetchAllProducts();
  }, []);

  const approveProduct = async (id) => {
    const res = await fetch(`/marketplace/admin/products/${id}/approve`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      message.success('Product approved');
      fetchPending();
      fetchAllProducts();
    }
  };

  const rejectProduct = async (id) => {
    let reason = '';
    Modal.confirm({
      title: 'Reject Product',
      content: (
        <Input placeholder="Reason (optional)" onChange={(e) => { reason = e.target.value; }} />
      ),
      onOk: async () => {
        const res = await fetch(`/marketplace/admin/products/${id}/reject`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ reason }),
        });
        if (res.ok) {
          message.success('Product rejected');
          fetchPending();
        }
      },
    });
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setEditModalOpen(true);
    form.setFieldsValue({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
      image: product.image || '',
    });
  };

  const saveProduct = async () => {
    const values = await form.validateFields();
    const res = await fetch(`/dashboard/vendor/${editingProduct._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      message.success('Product updated');
      setEditModalOpen(false);
      setEditingProduct(null);
      fetchAllProducts();
      fetchPending();
    }
  };

  const deleteProduct = async (id) => {
    const res = await fetch(`/dashboard/vendor/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      message.success('Product removed');
      fetchAllProducts();
      fetchPending();
    }
  };

  const blockVendor = async (id) => {
    const res = await fetch(`/api/admin/vendors/${id}/block`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) { message.success('Vendor blocked'); fetchVendors(); }
  };

  const approveVendor = async (id) => {
    const res = await fetch(`/api/admin/vendors/${id}/approve`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) { message.success('Vendor approved'); fetchVendors(); }
  };

  const deleteVendor = async (id) => {
    Modal.confirm({
      title: 'Delete Vendor',
      content: 'Are you sure you want to delete this vendor and all their products?',
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const res = await fetch(`/api/admin/vendors/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
          const data = await res.json();
          if (!res.ok || !data?.success) throw new Error(data.message || 'Failed to delete vendor');
          message.success('Vendor deleted');
          setVendors((prev) => prev.filter((v) => v._id !== id));
          fetchAllProducts();
        } catch (e) {
          message.error(e.message);
        }
      }
    });
  };

  const pendingCols = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Vendor', dataIndex: ['vendorId', 'name'] },
    { title: 'Category', dataIndex: 'category' },
    { title: 'Price', dataIndex: 'price' },
    {
      title: 'Actions',
      render: (_, rec) => (
        <Space>
          <Button type="primary" onClick={() => approveProduct(rec._id)}>Approve</Button>
          <Button danger onClick={() => rejectProduct(rec._id)}>Reject</Button>
        </Space>
      )
    }
  ];

  const allProductCols = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Category', dataIndex: 'category' },
    { title: 'Price', dataIndex: 'price' },
    { title: 'Stock', dataIndex: 'stock' },
    {
      title: 'Actions',
      render: (_, rec) => (
        <Space>
          <Button onClick={() => openEditProduct(rec)}>Edit</Button>
          <Button danger onClick={() => deleteProduct(rec._id)}>Delete</Button>
        </Space>
      )
    }
  ];

  const vendorCols = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => {
        if (status === 'blocked') return <span className="text-red-600">Blocked</span>;
        if (status === 'pending') return <span className="text-orange-600">Pending</span>;
        return <span className="text-green-600">Unblocked</span>;
      }
    },
    {
      title: 'Actions',
      render: (_, rec) => (
        <Space>
          {rec.status === 'blocked' && (
            <Button type="primary" onClick={() => approveVendor(rec._id)}>Unblock</Button>
          )}
          {rec.status === 'active' && (
            <Button danger onClick={() => blockVendor(rec._id)}>Block Vendor</Button>
          )}
          {rec.status === 'pending' && (
            <Button type="primary" onClick={() => approveVendor(rec._id)}>Approve Vendor</Button>
          )}
          <Button danger onClick={() => deleteVendor(rec._id)}>Delete</Button>
        </Space>
      )
    }
  ];

  const filteredVendors = vendors.filter((v) => {
    if (vendorStatusFilter === 'all') return true;
    return v.status === vendorStatusFilter;
  });

  return (
    <>
      <Tabs
        items={[
          { key: 'pending', label: 'Pending Products', children: <Table rowKey="_id" dataSource={pendingProducts} columns={pendingCols} /> },
          { key: 'products', label: 'All Products', children: <Table rowKey="_id" dataSource={allProducts} columns={allProductCols} /> },
          { key: 'vendors', label: 'Vendors', children: (
            <>
              <div className="mb-3 flex items-center gap-2">
                <span>Status:</span>
                <Select
                  value={vendorStatusFilter}
                  style={{ width: 180 }}
                  onChange={setVendorStatusFilter}
                  options={[
                    { value: 'all', label: 'All' },
                    { value: 'active', label: 'Unblocked' },
                    { value: 'blocked', label: 'Blocked' },
                    { value: 'pending', label: 'Pending' },
                  ]}
                />
              </div>
              <Table rowKey="_id" dataSource={filteredVendors} columns={vendorCols} />
            </>
          ) },
        ]}
      />

      <Modal open={editModalOpen} title="Edit Product" onOk={saveProduct} onCancel={() => setEditModalOpen(false)} okText="Save">
        <Form form={form} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Price" name="price" rules={[{ required: true }]}>
            <InputNumber className="w-full" min={0} />
          </Form.Item>
          <Form.Item label="Stock" name="stock" rules={[{ required: true }]}>
            <InputNumber className="w-full" min={0} />
          </Form.Item>
          <Form.Item label="Category" name="category" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'Furniture', label: 'Furniture' },
                { value: 'Decor', label: 'Decor' },
                { value: 'Kitchen', label: 'Kitchen' },
                { value: 'Lighting', label: 'Lighting' },
                { value: 'Textiles', label: 'Textiles' },
                { value: 'Storage', label: 'Storage' },
              ]}
            />
          </Form.Item>
          <Form.Item label="Image URL" name="image">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}