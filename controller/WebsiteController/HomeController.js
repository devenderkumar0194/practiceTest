const User = require('../../modal/UserModal');
const Helper = require('../../helper');
const jwt = require('jsonwebtoken');
const Product = require('../../modal/Product');

const home = async (req, res) => {
    
    

    console.log("home is called ");
    const token = req.cookies.token;
    if(token){
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded){
            req.user = await User.findOne({email : decoded.email});
            if(req.user.user_type == "admin"){
                return res.redirect('/admin/dashboard');
            }else {
                return res.redirect('/dashboard');
            }
        } else {
            const error = req.flash('error');
            return res.render('index', {error : error });
        }
    } else {
        const error = req.flash('error');
        return res.render('index', {error : error });
    }
}

const login = async (req, res) => {
    
    const { email , password } = req.body;
    
    if(!email || !password){
        req.flash('error', 'All Field is required');
        return res.redirect('/');
    }else {
        const user = await User.findOne({email: email});
        if(!user){
            req.flash('error', 'email is not found!');
            return res.redirect('/');
        }else {
            const match = await Helper.comparePassword(user, password);
            if(!match){
                req.flash('error', 'password is incorrect!');
                return res.redirect('/');
            }else {
            
                const userObj = { id: user.id, email: user.email, type : user.type };
                const token = jwt.sign(userObj, process.env.JWT_SECRET, { expiresIn: '1h' });  // Token expires in 1 hour

                res.cookie('token', token, {
                    httpOnly: true,     // prevents JS access
                    secure: true,       // send only on HTTPS
                    sameSite: 'strict', // CSRF protection
                    maxAge: 3600000     // 1 hour
                  });

                  console.log(user);

                  if(user.user_type == "admin"){
                        res.redirect('/admin/dashboard');
                  }else {
                        res.redirect('/dashboard');
                  }
            }
        }
    }
}

const adminDashboard = async (req, res) => {
    const error = req.flash('error');
    const errors = req.flash('errors');
    const success = req.flash('success');

    const products = await Product.find().sort({ createdAt: -1 });

    res.render('admin/dashboard', {error, errors, success, products });
    
}



const mainBanner = (req,res) => {    
    res.send("main banner called");
    return res.end();
}

const userDashboard = (req, res) => {

    console.log("user dashbaord called ");
 
    if(req.user.user_type !=  "user"){
      return  res.redirect('/');
    } else {

       return  res.send("dashboar");
    }   

    
}


const logout = (req, res) => {
    res.clearCookie("token");
    res.redirect('/')
}

module.exports = {
    home,
    login,
    mainBanner,
    adminDashboard,
    userDashboard,
    logout
}