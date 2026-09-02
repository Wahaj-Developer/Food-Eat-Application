const foodModel = require('../models/food.model')
const storageService =require('../services/storage.service')
const likeModel = require('../models/likes.model')
const saveModel =require('../models/save.model')



async function createFood(req, res) {

    try {

        if (!req.foodPartner) {

            return res.status(401).json({

                message:
                    'Food partner authentication required'

            })

        }


        const { videoUrl, fileId } = req.body

        if (!videoUrl || !fileId) {

            return res.status(400).json({

                message:
                    'Food video is required'

            })

        }


        const foodItem =
            await foodModel.create({

                name:
                    req.body.name,

                description:
                    req.body.description || '',

                video:
                    videoUrl,

                fileId:
                    fileId,

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
 * GET UPLOAD CREDENTIALS
 * =========================================
 *
 * GET /api/food/upload-credentials
 *
 * Food Partner only
 */

async function getUploadCredentials(req, res) {

    try {

        if (!req.foodPartner) {

            return res.status(401).json({

                message:
                    'Food partner authentication required'

            })

        }


        const credentials =
            storageService.getUploadAuthParams()


        return res.status(200).json({

            message:
                'Upload credentials generated successfully',

            credentials

        })


    } catch (error) {

        console.error(
            'Get upload credentials error:',
            error
        )


        return res.status(500).json({

            message:
                'Failed to generate upload credentials'

        })

    }

}




/**
 * =========================================
 * INTERLEAVE BY PARTNER
 * =========================================
 *
 * Takes a flat, newest-first list of food
 * items and mixes them so consecutive
 * videos come from different stores
 * instead of clustering by upload batch.
 *
 * Round-robin: one video from each store
 * per round, going round after round until
 * every video has been placed. Each store's
 * own videos stay newest-first relative to
 * each other.
 */

function interleaveByPartner(items) {

    const groups = new Map()

    const partnerOrder = []


    items.forEach((item) => {

        const partnerId =
            item.foodPartner?.toString?.() ||
            String(item.foodPartner)


        if (!groups.has(partnerId)) {

            groups.set(partnerId, [])
            partnerOrder.push(partnerId)

        }


        groups.get(partnerId).push(item)

    })


    const interleaved = []

    let remaining = items.length


    while (remaining > 0) {

        for (const partnerId of partnerOrder) {

            const queue =
                groups.get(partnerId)


            if (queue.length > 0) {

                interleaved.push(
                    queue.shift()
                )

                remaining -= 1

            }

        }

    }


    return interleaved

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


        const mixedFoodItems =
            interleaveByPartner(foodItems)


        /*
         * Fetch ALL of this user's likes and
         * saves in just two queries, instead of
         * two queries PER video. Then check
         * membership locally with a Set - no
         * extra database round-trips per video.
         */

        const [userLikes, userSaves] =
            await Promise.all([

                likeModel.find({
                    user:
                        user._id
                }),

                saveModel.find({
                    user:
                        user._id
                })

            ])


        const likedFoodIds =
            new Set(
                userLikes.map(
                    (like) =>
                        like.food.toString()
                )
            )


        const savedFoodIds =
            new Set(
                userSaves.map(
                    (save) =>
                        save.food.toString()
                )
            )


        const foodWithStatus =
            mixedFoodItems.map(
                (food) => {

                    return {

                        ...food.toObject(),

                        isLiked:
                            likedFoodIds.has(
                                food._id.toString()
                            ),

                        isSaved:
                            savedFoodIds.has(
                                food._id.toString()
                            )

                    }

                }
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


        /*
         * These two reads don't depend on each
         * other, so run them at the same time
         * instead of one after another.
         */

        const [food, isAlreadyLiked] =
            await Promise.all([

                foodModel.findById(
                    foodId
                ),

                likeModel.findOne({

                    user:
                        user._id,

                    food:
                        foodId

                })

            ])


        if (!food) {

            return res.status(404).json({

                message:
                    'Food not found'

            })

        }


     

        if (isAlreadyLiked) {

            await likeModel.deleteOne({

                user:
                    user._id,

                food:
                    foodId

            })


            const updatedFood =
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
                    },

                    {
                        new: true
                    }

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

        /*
         * Creating the like record and
         * incrementing the counter don't depend
         * on each other's result, so run them
         * together instead of sequentially.
         */

        const [, updatedFood] =
            await Promise.all([

                likeModel.create({

                    user:
                        user._id,

                    food:
                        foodId

                }),

                foodModel.findByIdAndUpdate(

                    foodId,

                    {
                        $inc: {
                            likeCount: 1
                        }
                    },

                    {
                        new: true
                    }

                )

            ])


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


        /*
         * These two reads don't depend on each
         * other, so run them at the same time
         * instead of one after another.
         */

        const [food, existingSave] =
            await Promise.all([

                foodModel.findById(
                    foodId
                ),

                saveModel.findOne({

                    user:
                        user._id,

                    food:
                        foodId

                })

            ])


        if (!food) {

            return res.status(404).json({

                message:
                    'Food not found'

            })

        }


     

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
                        new: true
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
                    new: true
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

    getSavedFood,

    getUploadCredentials

}
