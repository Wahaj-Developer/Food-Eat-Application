const foodModel = require('../models/food.model')
const storageService =require('../services/storage.service')
const likeModel = require('../models/likes.model')
const saveModel =require('../models/save.model')
const { randomUUID } =require('crypto')



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
                randomUUID()
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


  
        if (
            food.foodPartner.toString() !==
            foodPartner._id.toString()
        ) {

            return res.status(403).json({

                message:
                    'You are not allowed to delete this food'

            })

        }


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


  
        await likeModel.deleteMany({

            food:
                food._id

        })


  
        await saveModel.deleteMany({

            food:
                food._id

        })


        
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



async function saveFood(req, res) {

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


     

        const existingSave =
            await saveModel.findOne({

                user:
                    user._id,

                food:
                    foodId

            })


        if (existingSave) {

           

            await saveModel.deleteMany({

                user:
                    user._id,

                food:
                    foodId

            })


 
            const realSavesCount =
                await saveModel.countDocuments({

                    food:
                        foodId

                })


        

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





module.exports = {

    createFood,

    getFoodItems,

    deleteFood,

    likeFood,

    saveFood,

    getSavedFood

}
