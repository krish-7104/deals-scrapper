const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js');
const priceController = require('../controllers/price.controller.js');

router.route('/register').post(userController.register);
router.route('/login').post(userController.login);
router.route('/forgotPassword').post(userController.forgotPassword);
router.route('/resetPassword').post(userController.resetPassword);
router.route('/priceToCompare').post(priceController.priceToCompare);


module.exports = router;
