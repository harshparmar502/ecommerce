require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const Product = mongoose.model('Product', new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
  category: String,
  stock: { type: Number, default: 0 }
}, { timestamps: true }));

app.get('/api/products', async (req, res) => {
  res.json(await Product.find());
});

app.get('/api/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

app.post('/api/products', async (req, res) => {
  res.status(201).json(await Product.create(req.body));
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log('API running on port ' + (process.env.PORT || 5000)));
  })
  .catch(err => console.error('Connection error:', err.message));