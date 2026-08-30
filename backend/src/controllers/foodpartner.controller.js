const foodPartnerModel =
    require('../models/foodpartner.model')

const foodModel =
    require('../models/food.model')

const likeModel =
    require('../models/likes.model')


/**
 * =========================================
 * GET MY FOOD PARTNER PROFILE
 * =========================================
 *
 * GET /api/foodpartner/profile
 *
 * Food Partner only
 */

async function getMyProfile(req, res) {

    try {

        const foodPartner = req.foodPartner


        if (!foodPartner) {

            return res.status(401).json({
                message:
                    'Food partner authentication required'
            })

        }


        const foodItems =
            await foodModel
                .find({
                    foodPartner: foodPartner._id
                })
                .sort({
                    createdAt: -1
                })
                .lean()


        /*
         * Calculate total likes
         * across all videos.
         */

        const totalLikes =
            foodItems.reduce(
                (total, food) => {

                    return total + (
                        food.likeCount || 0
                    )

                },
                0
            )


        return res.status(200).json({

            message:
                'Food partner profile fetched successfully',

            foodPartner: {

                _id: foodPartner._id,

                name: foodPartner.name,

                email: foodPartner.email,

                phone: foodPartner.phone,

                address: foodPartner.address,

                contactName:
                    foodPartner.contactName,

                foodItems,

                totalPosts:
                    foodItems.length,

                totalLikes

            }

        })


    } catch (error) {

        console.error(
            'Error fetching own food partner profile:',
            error
        )


        return res.status(500).json({

            message:
                'Internal server error'

        })

    }

}


/**
 * =========================================
 * GET FOOD PARTNER BY ID
 * =========================================
 *
 * GET /api/foodpartner/:id
 *
 * Logged-in User
 */

async function getFoodPartnerById(req, res) {

    try {

        const { id } = req.params


        /*
         * Validate ObjectId before querying MongoDB.
         * This prevents:
         *
         * CastError: Cast to ObjectId failed
         */

        const mongoose = require('mongoose')


        if (!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({

                message:
                    'Invalid food partner ID'

            })

        }


        const foodPartner =
            await foodPartnerModel
                .findById(id)
                .lean()


        if (!foodPartner) {

            return res.status(404).json({

                message:
                    'Food partner not found'

            })

        }


        const foodItems =
            await foodModel
                .find({
                    foodPartner: foodPartner._id
                })
                .sort({
                    createdAt: -1
                })
                .lean()


        /*
         * Total likes on all videos.
         */

        const totalLikes =
            foodItems.reduce(
                (total, food) => {

                    return total + (
                        food.likeCount || 0
                    )

                },
                0
            )


        return res.status(200).json({

            message:
                'Food partner fetched successfully',

            foodPartner: {

                _id: foodPartner._id,

                name: foodPartner.name,

                email: foodPartner.email,

                phone: foodPartner.phone,

                address: foodPartner.address,

                contactName:
                    foodPartner.contactName,

                foodItems,

                totalPosts:
                    foodItems.length,

                totalLikes

            }

        })


    } catch (error) {

        console.error(
            'Error fetching food partner:',
            error
        )


        return res.status(500).json({

            message:
                'Internal server error'

        })

    }

}


module.exports = {

    getMyProfile,

    getFoodPartnerById

}