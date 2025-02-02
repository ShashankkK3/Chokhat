import { useState } from "react";
import axios from "axios";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/register", formData);
      alert(res.data.message);
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded shadow-md w-full max-w-md"
    >
      <h2 className="text-2xl font-bold mb-6">Register</h2>
      <input
        name="name"
        onChange={handleChange}
        placeholder="Name"
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <input
        name="email"
        onChange={handleChange}
        placeholder="Email"
        type="email"
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <input
        name="password"
        onChange={handleChange}
        placeholder="Password"
        type="password"
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <select
        name="role"
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="user">User</option>
        <option value="vendor">Vendor</option>
        <option value="admin">Admin</option>
      </select>
      <button className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600">
        Register
      </button>
    </form>
  );
}
