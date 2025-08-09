import { useState, useEffect } from 'react';
import { Table, Button, message, Modal, Form, Input, InputNumber, Select, Popconfirm } from 'antd';
import { useAuth } from '../../contexts/AuthContext';

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { user } = useAuth();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/dashboard/vendor', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        message.error('Failed to load products');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await fetch(`/dashboard/vendor/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProducts(products.filter(p => p._id !== id));
      message.success('Product deleted');
    } catch (error) {
      message.error('Delete failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (record) => {
    setEditingProduct(record);
    setIsModalOpen(true);
    form.setFieldsValue({
      name: record.name,
      price: record.price,
      stock: record.stock,
      category: record.category,
      image: record.image || '',
    });
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const res = await fetch(`/dashboard/vendor/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(values)
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Update failed');
      }
      const updated = await res.json();
      setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
      message.success('Product updated');
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      message.error(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      align: 'center',
      render: (src, record) => (
        src ? (
          <img
            src={src}
            alt={record.name}
            style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }}
          />
        ) : (
          <div style={{ width: 48, height: 48 }} className="bg-gray-100 rounded" />
        )
      ),
    },
    { title: 'Name', dataIndex: 'name', key: 'name', align: 'center' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Stock', dataIndex: 'stock', key: 'stock' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button onClick={() => openEdit(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure you want to delete this product?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const isBlockedVendor = user?.role === 'vendor' && user?.status !== 'active';

  return (
    <>
      {isBlockedVendor && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200 text-center">
          You are Blocked
        </div>
      )}
      <Table 
        dataSource={products} 
        columns={columns} 
        loading={loading}
        rowKey="_id"
      />

      <Modal
        title="Edit Product"
        open={isModalOpen}
        onOk={handleUpdate}
        onCancel={() => { setIsModalOpen(false); setEditingProduct(null); }}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter product name' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please enter price' }]}>
            <InputNumber className="w-full" min={0} />
          </Form.Item>
          <Form.Item label="Stock" name="stock" rules={[{ required: true, message: 'Please enter stock' }]}>
            <InputNumber className="w-full" min={0} />
          </Form.Item>
          <Form.Item label="Category" name="category" rules={[{ required: true, message: 'Please select a category' }]}>
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