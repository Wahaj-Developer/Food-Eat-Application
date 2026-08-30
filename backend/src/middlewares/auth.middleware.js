const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
const foodPartnerModel = require('../models/foodpartner.model')


/**
 * =========================================
 * USER AUTHENTICATION
 * =========================================
 */

const authUserMiddleware = async (req, res, next) => {

    try {

        const token = req.cookies.token


        if (!token) {

            return res.status(401).json({
                message: 'Authentication required'
            })

        }


        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )


        const user = await userModel.findById(
            decoded.id
        )


        if (!user) {

            return res.status(401).json({
                message: 'User not found'
            })

        }


        req.user = user


        next()


    } catch (error) {

        console.error(
            'User authentication error:',
            error
        )


        return res.status(401).json({
            message: 'Invalid or expired token'
        })

    }

}


/**
 * =========================================
 * FOOD PARTNER AUTHENTICATION
 * =========================================
 */

const authFoodPartnerMiddleware = async (
    req,
    res,
    next
) => {

    try {

        const token = req.cookies.token


        if (!token) {

            return res.status(401).json({
                message: 'Authentication required'
            })

        }


        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )


        const foodPartner =
            await foodPartnerModel.findById(
                decoded.id
            )


        if (!foodPartner) {

            return res.status(401).json({
                message: 'Food partner not found'
            })

        }


        /*
         * Make the logged-in food partner
         * available to controllers.
         */

        req.foodPartner = foodPartner


        next()


    } catch (error) {

        console.error(
            'Food partner authentication error:',
            error
        )


        return res.status(401).json({
            message: 'Invalid or expired token'
        })

    }

}


module.exports = {

    authUserMiddleware,

    authFoodPartnerMiddleware

}