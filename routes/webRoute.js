const express = require('express');
const multer = require('multer');
const path = require('path');

const UserMiddleware = require('../middleware/userMiddleware');
const HomeControler = require('../controller/WebsiteController/HomeController');
const ProductController = require('../controller/WebsiteController/ProductController');

const webRouter = express.Router();
const userWebRoute = express.Router();
const adminWebRoute = express.Router();


// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage: storage });

// web routes 
webRouter.get("/", HomeControler.home);

webRouter.post("/login", HomeControler.login);
webRouter.get("/main-banner", HomeControler.mainBanner);

userWebRoute.use(UserMiddleware.webAuthCheck);
userWebRoute.get("/dashboard"  ,HomeControler.userDashboard);
userWebRoute.get("/logout"  ,HomeControler.logout);



userWebRoute.get("/add-product", ProductController.add );
userWebRoute.post("/store-product", upload.single('image') ,ProductController.store );




// auth Routes 
adminWebRoute.use(UserMiddleware.webAuthCheck, UserMiddleware.isAdmin);
adminWebRoute.get("/dashboard"  ,HomeControler.adminDashboard);



webRouter.use('/admin',adminWebRoute);
webRouter.use('/',userWebRoute);
module.exports = webRouter;