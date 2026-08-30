const express =require('express')
const authController =require('../controllers/auth.controller')

const router = express.Router();

/**
 * @name POST /user/register ---  /user/login ---  /user/logout
 * @access Public -- Public --- public
 * @description Register a new user. Loin the user. Logout the user
 */
router.post('/user/register',authController.registerUser)
router.post('/user/login',authController.loginUser)
router.post('/user/logout',authController.logoutUser)

/**
 * @name POST 
 * @access Public -- Public --- public
 * @description Register a new food partner. Login the food parnter. logout the food partner
 */
router.post('/foodpartner/register',authController.registerFoodPartner)
router.post('/foodpartner/login',authController.loginFoodPartner)
router.post('/foodpartner/logout',authController.logoutFoodPartner)

module.exports = router