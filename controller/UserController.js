
const Helper = require('../helper');
const UserModal = require('../modal/UserModal');
const Validation = require('../validation');
const Joi = require('joi'); 
const sendMail = require('../mail');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {

    const dataToValidate = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirm_password: req.body.confirm_password,
    };    
    
    const {error} =  Validation.registerSchema.validate(dataToValidate, {abortEarly: false}); 
    if (error) {        
        const allErrors = error.details.map( (err) => {
            const errorObject = {
                type: err.path[0],
                message : err.message
                
            }
            return errorObject;
        });
        return res.status(409).json({ status: "error", messages: allErrors });
    }else {
        
        const oldUser = await UserModal.findOne({ email : req.body.email}); 
        if(oldUser){
            res.send(409, {status : "error", message : "this email is allready registered!"});
        }else {
            
        const data = {
            name : req.body.name,
            email : req.body.email,
            password : await Helper.hashPassword(req.body.password),     
            otp : Math.floor(Math.random()*90000) + 10000,
            user_type : req.body.user_type
        };

        const user = await UserModal.create(data);
            // const mailObject = {
            //     to : data.email,
            //     subject : "register",
            //     html : "<h3>hello register suucess1 </h3>"
            // }
            // sendMail(mailObject);

            res.send(200, {status : 200, message : "successfully registered! ", data : user });
        }

    }

}

const sendOTP = async (req, res) => {
    var user = await UserModal.findOne({ email : req.body.email});
    if(!user){
        res.send(409, {status : "error", message : "This Email is does't exist!"});
    }else {
        const otp =  await Math.floor(Math.random()*90000) + 10000;
        await user.updateOne({otp: otp});


        // send otp on email 
        user = await UserModal.findOne({ email : req.body.email});
        res.send(200, {status : 200, message : "otp send successfully! ", data : user });

    }
}

const otpVerification =  async (req, res) => {

    const data = {
        email : req.body.email,
        otp : req.body.otp
    }

    var user = await UserModal.findOne({ email : req.body.email});
    if(!user){
        res.send(409, {status : "error", message : "This Email is does't exist!"});
    }else if(user.status == "active"){
        res.send(409, {status : "error", message : "This Email is already active!"});
    }else if(req.body.otp != user.otp) {
        res.send(409, {status : "error", message : "otp does't matched!"});          
    }else {
     
        await user.updateOne({
            otp : 0,
            status : "active"
        });

        const userObj = { id: user.id, email: user.email };
        const token = jwt.sign(userObj, process.env.JWT_SECRET, { expiresIn: '1h' });  // Token expires in 1 hour

        // Verify token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user to request object
        req.user = decoded;


        res.send(200, {status : 200, message : "otp verified successfully! ", data : token });
    }
}



const forgetPassword = (req, res) => {
    res.send("forgetPassword");
}


const login = async (req, res) => {

    const { email , password } = req.body;

    try {

        if(!email || !password){
        return res.send(409, {status : "error", message : "Email and Password Field is required!"});

    }else {
    
        const user = await UserModal.findOne({email: email});
        if(!user){
            return res.send(409, {status : "error", message : "email is not found!!"});
        }else {

            const match = await Helper.comparePassword(user, password);
            if(!match){
                return res.send(409, {status : "error", message : "password is incorrect"});
            }else {

                const userObj = { id: user.id, email: user.email, type : user.type };
                const token = jwt.sign(userObj, process.env.JWT_SECRET, { expiresIn: '1h' });  // Token expires in 1 hour

                return res.send(200, {status : 200, message : "login user successfully! ", data : token });
    
            }        
        }
        
    }



    } catch (err) {
      console.error(err);
    }
    
    



}



const dashboard = (req, res) => {
    res.send("dashboard");
}



const aboutUs = (req, res) => {


    res.send("aboutUs");
}

const getAdminDetails =  async (req, res) => {

    const admin = await UserModal.findOne({user_type : "admin"}).select("id name email user_type");
    data = admin;

    res.send(200, {status : 200, message : "get admin details successfully! ", data : data });    
}

module.exports = {
    register,
    sendOTP, 
    otpVerification,
    forgetPassword, 
    login,
    dashboard,
    aboutUs,

    getAdminDetails
    //fileUplaod,
    // multipleFilesUpload
    
}