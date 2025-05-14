
const Helper = require('../helper');
const UserModal = require('../modal/UserModal');
const Validation = require('../validation');
const Joi = require('joi'); 
const sendMail = require('../mail');
const jwt = require('jsonwebtoken');
const Product = require('../modal/Product');


const productList = async (req, res) => {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({ status: "success", data : products });
}

module.exports = {
    productList,
}