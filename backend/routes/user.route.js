const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js');
const priceController = require('../controllers/price.controller.js');

router.route('/register').post(userController.register);
router.route('/login').post(userController.login);
router.route('/get-user').post(userController.user);
router.route('/forgotPassword').post(userController.forgotPassword);
router.route('/updatePassword').post(userController.updatePassword);
router.route('/priceToCompare').post(priceController.priceToCompare);
router.route('/deleteTracker/:id').delete(priceController.deleteTracker);
router.route('/userTracker/:email').get(priceController.userTracker);



module.exports = router;
