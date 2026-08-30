const express = require('express')

const foodController =
    require('../controllers/food.controller')

const authMiddleware =
    require('../middlewares/auth.middleware')

const multer =
    require('multer')


const router =
    express.Router()


const upload =
    multer({
        storage:
            multer.memoryStorage()
    })


/**
 * =========================================
 * CREATE FOOD
 * =========================================
 *
 * POST /api/food
 *
 * Food Partner only
 */

router.post(
    '/',
    authMiddleware.authFoodPartnerMiddleware,
    upload.single('video'),
    foodController.createFood
)


/**
 * =========================================
 * GET ALL FOOD
 * =========================================
 *
 * GET /api/food
 *
 * User only
 */

router.get(
    '/',
    authMiddleware.authUserMiddleware,
    foodController.getFoodItems
)


/**
 * =========================================
 * DELETE FOOD
 * =========================================
 *
 * DELETE /api/food/:id
 *
 * Food Partner only
 */

router.delete(
    '/:id',
    authMiddleware.authFoodPartnerMiddleware,
    foodController.deleteFood
)


/**
 * =========================================
 * LIKE / UNLIKE
 * =========================================
 */

router.post(
    '/like',
    authMiddleware.authUserMiddleware,
    foodController.likeFood
)


/**
 * =========================================
 * SAVE / UNSAVE
 * =========================================
 */

router.post(
    '/save',
    authMiddleware.authUserMiddleware,
    foodController.saveFood
)


/**
 * =========================================
 * GET SAVED FOOD
 * =========================================
 */

router.get(
    '/save',
    authMiddleware.authUserMiddleware,
    foodController.getSavedFood
)


module.exports = router