const { required } = require('joi');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 100
    },
    price: {
        type: Number,
        required: true,
        min: 1,
    },
    image: {
        type: String,
        required: false,
    },
    

  },
  {
    timestamps: true
  }
);

const ProductModal = mongoose.model('Product', productSchema);
module.exports = ProductModal;