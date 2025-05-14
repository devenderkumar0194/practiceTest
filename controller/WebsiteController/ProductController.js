const User = require('../../modal/UserModal');
const Helper = require('../../helper');
const jwt = require('jsonwebtoken');
const Joi = require('joi'); 
const Validation = require('../../validation');
const Product = require('../../modal/Product');

const add = (req, res) => {
    const error = req.flash('error');
    const errors = req.flash('errors');
    res.render('admin/product/add', {error : error, errors : errors });

}


const store = async (req, res) => {
    const { name , price } = req.body;
    const image = req.file && req.file.filename ?  req.file.filename : "";

    const dataToValidate = {
        name: name,
        price: price,
    };    
    
    const {error} =  Validation.addProduct.validate(dataToValidate, {abortEarly: false}); 

    if (error) {        
        const allErrors = error.details.map( (err) => {
            const errorObject = {
                type: err.path[0],
                message : err.message
                
            }
            return errorObject;
        });

        // req.flash('error', 'email is not found!');
        req.flash('errors', allErrors);
        return res.redirect('/add-product');

    }else {

        await Product.create({ name : name, price : price, image : image });
        req.flash('success', 'product add successfully');

        return res.redirect('/admin/dashboard');
    }

}



module.exports = {
    add,
    store



    
}