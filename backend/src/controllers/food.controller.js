const foodModel =
    require('../models/food.model')


const storageService =
    require('../services/storage.service')


const likeModel =
    require('../models/likes.model')


const saveModel =
    require('../models/save.model')


const { v4: uuidv4 } =
    require('uuid')



/**
 * =========================================
 * CREATE FOOD
 * =========================================
 *
 * POST /api/food
 *
 * Food Partner only
 */

async function createFood(req, res) {

    try {

        if (!req.foodPartner) {

            return res.status(401).json({

                message:
                    'Food partner authentication required'

            })

        }


        if (!req.file) {

            return res.status(400).json({

                message:
                    'Food video is required'

            })

        }


        const fileUploadResult =
            await storageService.uploadFile(
                req.file.buffer,
                uuidv4()
            )


        const foodItem =
            await foodModel.create({

                name:
                    req.body.name,

                description:
                    req.body.description || '',

                video:
                    fileUploadResult.url,

                fileId:
                    fileUploadResult.fileId,

                foodPartner:
                    req.foodPartner._id,

                likeCount:
                    0,

                savesCount:
                    0

            })


        return res.status(201).json({

            message:
                'Food item is created successfully',

            food:
                foodItem

        })


    } catch (error) {

        console.error(
            'Create food error:',
            error
        )


        return res.status(500).json({

            message:
                'Failed to create food item'

        })

    }

}



/**
 * =========================================
 * GET ALL FOOD ITEMS
 * =========================================
 *
 * GET /api/food
 *
 * Logged-in User
 */

async function getFoodItems(req, res) {

    try {

        const user =
            req.user


        const foodItems =
            await foodModel
                .find({})
                .sort({
                    createdAt: -1
                })


        const foodWithStatus =
            await Promise.all(

                foodItems.map(
                    async (food) => {

                        const isLiked =
                            await likeModel.findOne({

                                user:
                                    user._id,

                                food:
                                    food._id

                            })


                        const isSaved =
                            await saveModel.findOne({

                                user:
                                    user._id,

                                food:
                                    food._id

                            })


                        return {

                            ...food.toObject(),

                            isLiked:
                                !!isLiked,

                            isSaved:
                                !!isSaved

                        }

                    }
                )

            )


        return res.status(200).json({

            message:
                'Food items fetched successfully',

            food:
                foodWithStatus

        })


    } catch (error) {

        console.error(
            'Get food error:',
            error
        )


        return res.status(500).json({

            message:
                'Failed to fetch food items'

        })

    }

}



/**
 * =========================================
 * DELETE FOOD
 * =========================================
 *
 * DELETE /api/food/:id
 *
 * Food Partner only
 */

async function deleteFood(req, res) {

    try {

        const { id } =
            req.params


        const foodPartner =
            req.foodPartner


        if (!foodPartner) {

            return res.status(401).json({

                message:
                    'Food partner authentication required'

            })

        }


        const mongoose =
            require('mongoose')


        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {

            return res.status(400).json({

                message:
                    'Invalid food ID'

            })

        }


        const food =
            await foodModel.findById(id)


        if (!food) {

            return res.status(404).json({

                message:
                    'Food not found'

            })

        }


        /*
         * Make sure the food belongs
         * to the logged-in food partner.
         */

        if (
            food.foodPartner.toString() !==
            foodPartner._id.toString()
        ) {

            return res.status(403).json({

                message:
                    'You are not allowed to delete this food'

            })

        }


        // =========================================
        // DELETE FROM IMAGEKIT
        // =========================================

        if (food.fileId) {

            try {

                await storageService.deleteFile(
                    food.fileId
                )

            } catch (imageKitError) {

                console.error(
                    'ImageKit delete error:',
                    imageKitError
                )


                return res.status(500).json({

                    message:
                        'Failed to delete video from storage'

                })

            }

        }


        // =========================================
        // DELETE LIKES
        // =========================================

        await likeModel.deleteMany({

            food:
                food._id

        })


        // =========================================
        // DELETE SAVES
        // =========================================

        await saveModel.deleteMany({

            food:
                food._id

        })


        // =========================================
        // DELETE FOOD
        // =========================================

        await foodModel.deleteOne({

            _id:
                food._id

        })


        return res.status(200).json({

            message:
                'Food deleted successfully',

            foodId:
                food._id

        })


    } catch (error) {

        console.error(
            'Delete food error:',
            error
        )


        return res.status(500).json({

            message:
                'Failed to delete food'

        })

    }

}



/**
 * =========================================
 * LIKE / UNLIKE FOOD
 * =========================================
 */

async function likeFood(req, res) {

    try {

        const { foodId } =
            req.body


        const user =
            req.user


        if (!foodId) {

            return res.status(400).json({

                message:
                    'Food ID is required'

            })

        }


        const food =
            await foodModel.findById(
                foodId
            )


        if (!food) {

            return res.status(404).json({

                message:
                    'Food not found'

            })

        }


        const isAlreadyLiked =
            await likeModel.findOne({

                user:
                    user._id,

                food:
                    foodId

            })


        // =========================================
        // UNLIKE
        // =========================================

        if (isAlreadyLiked) {

            await likeModel.deleteOne({

                user:
                    user._id,

                food:
                    foodId

            })


            await foodModel.findOneAndUpdate(

                {
                    _id:
                        foodId,

                    likeCount: {
                        $gt: 0
                    }

                },

                {
                    $inc: {
                        likeCount: -1
                    }
                }

            )


            const updatedFood =
                await foodModel.findById(
                    foodId
                )


            return res.status(200).json({

                message:
                    'Food unliked successfully',

                liked:
                    false,

                likeCount:
                    updatedFood?.likeCount ?? 0

            })

        }


        // =========================================
        // LIKE
        // =========================================

        await likeModel.create({

            user:
                user._id,

            food:
                foodId

        })


        const updatedFood =
            await foodModel.findByIdAndUpdate(

                foodId,

                {
                    $inc: {
                        likeCount: 1
                    }
                },

                {
                    returnDocument: 'after'
                }

            )


        return res.status(200).json({

            message:
                'Food liked successfully',

            liked:
                true,

            likeCount:
                updatedFood?.likeCount ?? 0

        })


    } catch (error) {

        console.error(
            'Like food error:',
            error
        )


        return res.status(500).json({

            message:
                'Failed to like food'

        })

    }

}



/**
 * =========================================
 * SAVE / UNSAVE FOOD
 * =========================================
 */

async function saveFood(req, res) {

    try {

        const { foodId } =
            req.body


        const user =
            req.user


        // =========================================
        // VALIDATE FOOD ID
        // =========================================

        if (!foodId) {

            return res.status(400).json({

                message:
                    'Food ID is required'

            })

        }


        // =========================================
        // CHECK FOOD
        // =========================================

        const food =
            await foodModel.findById(
                foodId
            )


        if (!food) {

            return res.status(404).json({

                message:
                    'Food not found'

            })

        }


        // =========================================
        // CHECK EXISTING SAVE
        // =========================================

        const existingSave =
            await saveModel.findOne({

                user:
                    user._id,

                food:
                    foodId

            })


        // =========================================
        // UNSAVE
        // =========================================

        if (existingSave) {

            /*
             * Remove ALL duplicate save records
             * for this user and this food.
             */

            await saveModel.deleteMany({

                user:
                    user._id,

                food:
                    foodId

            })


            /*
             * Count the REAL number of saves
             * remaining for this food.
             */

            const realSavesCount =
                await saveModel.countDocuments({

                    food:
                        foodId

                })


            /*
             * Synchronize savesCount with
             * the actual save documents.
             */

            const updatedFood =
                await foodModel.findByIdAndUpdate(

                    foodId,

                    {
                        $set: {
                            savesCount:
                                realSavesCount
                        }
                    },

                    {
                        returnDocument: 'after'
                    }

                )


            return res.status(200).json({

                message:
                    'Food unsaved successfully',

                saved:
                    false,

                savesCount:
                    updatedFood?.savesCount ?? 0

            })

        }


        // =========================================
        // SAVE
        // =========================================

        await saveModel.create({

            user:
                user._id,

            food:
                foodId

        })


        /*
         * Count the REAL number of saves.
         */

        const realSavesCount =
            await saveModel.countDocuments({

                food:
                    foodId

            })


        /*
         * Synchronize savesCount.
         */

        const updatedFood =
            await foodModel.findByIdAndUpdate(

                foodId,

                {
                    $set: {
                        savesCount:
                            realSavesCount
                    }
                },

                {
                    returnDocument: 'after'
                }

            )


        return res.status(200).json({

            message:
                'Food saved successfully',

            saved:
                true,

            savesCount:
                updatedFood?.savesCount ?? 0

        })


    } catch (error) {

        console.error(
            'Save food error:',
            error
        )


        return res.status(500).json({

            message:
                'Failed to save food'

        })

    }

}



/**
 * =========================================
 * GET SAVED FOOD
 * =========================================
 */

async function getSavedFood(req, res) {

    try {

        const user =
            req.user


        const savedFoods =
            await saveModel
                .find({

                    user:
                        user._id

                })
                .populate('food')


        return res.status(200).json({

            message:
                'Saved food fetched successfully',

            savedFoods

        })


    } catch (error) {

        console.error(
            'Get saved food error:',
            error
        )


        return res.status(500).json({

            message:
                'Failed to fetch saved food'

        })

    }

}



/**
 * =========================================
 * EXPORT CONTROLLERS
 * =========================================
 */

module.exports = {

    createFood,

    getFoodItems,

    deleteFood,

    likeFood,

    saveFood,

    getSavedFood

}