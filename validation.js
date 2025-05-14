const Joi = require('joi');

const registerSchema = Joi.object({ 
    name: Joi.string().required(), 
    email: Joi.string().required().email(), 
    password: Joi.string().required(), 
    // confirm_password: Joi.string().required(), 
    confirm_password: Joi.string().valid(Joi.ref('password')).required()

    
});

const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    age: Joi.number().integer().min(1).max(120).required(),
    email: Joi.string().email().required()
});


const addProduct = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    price: Joi.number().integer().min(1).required(),
});


module.exports = {
    registerSchema,
    schema,
    addProduct
}

