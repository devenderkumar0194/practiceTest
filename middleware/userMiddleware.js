const jwt = require('jsonwebtoken');
const User = require('../modal/UserModal');
const authCheck = async (req, res, next) => {
    console.log("middleware called !!");

    const token = req.headers['authorization'];
    if (!token) {
        return res.status(409).send({ status: "error", message: "A token is required for authentication!" });

    }else {
        try {
            // Remove "Bearer " if present
            const bearerToken = token.split(' ')[1];
            
            // Verify token using the secret key
            const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
            console.log(decoded);

            // Attach user to request object
            req.user = decoded;
        } catch (err) {

            return res.status(409).send({ status: "error", message: "Invalid Token" });

        }
    }
    next();
}



const webAuthCheck = async (req, res, next) => {

    if (req.path.startsWith('/api')) {
        return next(); // skip web-only logic
    }



    const token = req.cookies.token;
    console.log("web auth check");

    if(!token){
        req.flash('error', 'token is not found!');
        return res.redirect('/');
    }else {
        // Verify token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded){
            req.user = await User.findOne({email : decoded.email});
            next();
        }        
    }
}

const isAdmin = (req, res, next) => {

    console.log("admin check");
    const user = req.user;
    if(user.user_type == "admin"){
        next();
    }else {
        req.flash('error', 'you dont have access!');
        return res.redirect('/');
    }
}
 

module.exports = {
    authCheck,
    webAuthCheck,
    isAdmin
}