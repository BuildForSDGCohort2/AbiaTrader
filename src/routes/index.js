import express from 'express';
import validator from '../middlewares/validator';
import authenticator from '../middlewares/authenticator';
import users from '../controllers/users';
import product from '../controllers/product';
import business from '../controllers/business';
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

 // Upload image to cloudinary
cloudinary.config({
    cloud_name: 'ds5hogj9b',
    api_key: '657785678132187',
    api_secret: 'EcvkztYhPW8egTvRTo10OdiJpwU'
});

const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "demo",
    allowedFormats: ["jpg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }]
    });
const parser = multer({ storage: storage });

const router = express.Router();
// use image in photo file upload form name
// user auth
router.post('/auth/create-user',  parser.single("image"), validator.auth,  users.signup);
router.post('/signup', validator.auth,  users.userSignup);
router.post('/auth/signin', validator.auth, users.login);
router.post('/signin', validator.auth, users.userLogin);
router.get('/users', users.getAllUsers);
router.post('/user/dashboard/addbusiness', authenticator, business.addBusiness);
router.put('/user/dashboard/editbusiness', authenticator, business.editBusiness);
router.post('/business/rating', business.addRating);
router.get('/business/search', business.searchBusiness);
router.get('/user/dashboard/mybusiness', authenticator, business.getBusiness);
router.get('/home/business', business.getAllBusiness);
router.post('/upload', parser.single("image"), users.upload );
router.get('/traders/all', users.getAll);
router.get('/traders/count',  users.getCount);
router.put('/trader/update/:userId', authenticator, validator.auth, users.editTrader);
router.put('/user/dashboard/editprofile', authenticator, users.editUser);
router.put('/user/password/change', validator.auth, authenticator, users.changePassword);
router.put('/user/profile-photo/change', authenticator, parser.single("image"), users.changeUserPhoto); 
router.get('/user/:userId',  users.getUser);
router.get('/user/:userId/email',  users.getUserEmail);
router.post('/user/email', users.postEmail);
// Create product
router.post('/product/add', authenticator, parser.single("image"), product.create);
router.put('/product/:productId/edit', authenticator, parser.single("image"), validator.checkProductIdParams, product.edit);
router.post('/product/order', product.order);
router.get('/products/all', product.getAllForBuy);
router.get('/:productName/traders', product.getTradersDetails);
router.get('/product/search/', product.searchProduct);
router.get('/product/:productId',  product.getOne);
router.get('/user/:userId/products',  product.getAllForUser);
// Delete a product
router.delete('/product/:productId', authenticator, validator.checkProductIdParams, product.delete);

export default router;
