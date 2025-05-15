const express = require('express');
const apiRouter = express.Router();
const apiAuthRouter = express.Router();

const UserController = require('../controller/UserController');
const ProductControllerAPI = require('../controller/ProductControllerAPI');

const userMiddleware = require('../middleware/userMiddleware');

apiRouter.post("/register", UserController.register);
apiRouter.post("/sendOTP", UserController.sendOTP);
apiRouter.post("/otpVerification", UserController.otpVerification);
apiRouter.post("/forgetPassword", UserController.otpVerification);
apiRouter.get("/get-admin-details", UserController.getAdminDetails);
apiRouter.post("/login", UserController.login);



apiRouter.get("/product-list", ProductControllerAPI.productList);

// auth routes 
apiAuthRouter.get("/dashboard", UserController.dashboard);
apiAuthRouter.get("/about-us", UserController.aboutUs);


apiRouter.use('/', userMiddleware.authCheck ,apiAuthRouter);



module.exports = apiRouter;