const express = require('express')

const foodPartnerController =
    require('../controllers/foodpartner.controller')

const authMiddleware =
    require('../middlewares/auth.middleware')

const router = express.Router()


/**
 * =========================================
 * GET CURRENT FOOD PARTNER PROFILE
 * =========================================
 *
 * GET /api/foodpartner/profile
 *
 * Food Partner only
 */

router.get(
    '/profile',
    authMiddleware.authFoodPartnerMiddleware,
    foodPartnerController.getMyProfile
)


/**
 * =========================================
 * GET FOOD PARTNER BY ID
 * =========================================
 *
 * GET /api/foodpartner/:id
 *
 * Logged-in User
 */

router.get(
    '/:id',
    authMiddleware.authUserMiddleware,
    foodPartnerController.getFoodPartnerById
)


module.exports = router