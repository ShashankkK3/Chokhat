import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Furniture', 'Decor', 'Kitchen', 'Lighting', 'Textiles', 'Storage']
  },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String }, // URL to image
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Product', productSchema);