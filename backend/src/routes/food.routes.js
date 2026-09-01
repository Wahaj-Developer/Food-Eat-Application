const express = require('express')
const foodController =require('../controllers/food.controller')
const authMiddleware = require('../middlewares/auth.middleware')


const router = express.Router()


router.post(
    '/',
    authMiddleware.authFoodPartnerMiddleware,
    foodController.createFood
)



router.get(
    '/upload-credentials',
    authMiddleware.authFoodPartnerMiddleware,
    foodController.getUploadCredentials
)




router.get(
    '/',
    authMiddleware.authUserMiddleware,
    foodController.getFoodItems
)


router.delete(
    '/:id',
    authMiddleware.authFoodPartnerMiddleware,
    foodController.deleteFood
)




router.post(
    '/like',
    authMiddleware.authUserMiddleware,
    foodController.likeFood
)



router.post(
    '/save',
    authMiddleware.authUserMiddleware,
    foodController.saveFood
)




router.get(
    '/save',
    authMiddleware.authUserMiddleware,
    foodController.getSavedFood
)


module.exports = router
