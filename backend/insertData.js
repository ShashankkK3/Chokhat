import Product from './models/Product.js';
import mongoose from 'mongoose';

const dummyData = [
    
        {
          "name": "Handcrafted Brass Diya Set",
          "price": 2899,
          "category": "Decor",
          "vendorId": "68782428f81568161b2faa2c", // Replace with actual vendor ID
          "image": "https://tse3.mm.bing.net/th/id/OIP.zwe1T_zUBKX8jO6yWY1mUwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
          "createdAt": "2024-03-20T10:00:00Z"
        },
        {
          "name": "Traditional Wooden Coffee Table",
          "price": 15999,
          "category": "Furniture",
          "vendorId": "68782428f81568161b2faa2c",
          "image": "https://amwoodstore.com/wp-content/uploads/2023/07/25-2.jpg",
          "createdAt": "2024-03-19T15:30:00Z"
        },
        {
          "name": "Handwoven Cotton Cushion Covers (Set of 2)",
          "price": 2649,
          "category": "Textiles",
          "vendorId": "68782428f81568161b2faa2c", // Different vendor
          "image": "https://nestasia.in/cdn/shop/files/DSC6165_9e99bbea-182b-4cff-9729-debefa85f159.jpg?v=1686566110&width=600",
          "createdAt": "2024-03-18T11:20:00Z"
        },
        {
          "name": "Copper Kitchen Utensil Set",
          "price": 22499,
          "category": "Kitchen",
          "vendorId": "68782428f81568161b2faa2c",
          "image": "https://curlytales.com/wp-content/uploads/2023/06/copper-utensils.jpg",
          "createdAt": "2024-03-17T09:45:00Z"
        },
        {
          "name": "Antique Brass Floor Lamp",
          "price": 18499,
          "category": "Lighting",
          "vendorId": '68782428f81568161b2faa2c',
          "image": "https://tse4.mm.bing.net/th/id/OIP.LSmcD5UOfV0U5dx8XyllgQHaHa?w=1080&h=1080&rs=1&pid=ImgDetMain&o=7&rm=3",
          "createdAt": "2024-03-16T14:15:00Z"
        }
      
];

async function insertData() {
  await mongoose.connect('mongodb://localhost:27017/chokhat');
  await Product.insertMany(dummyData);
  console.log("Data inserted!");
  process.exit();
}

insertData();