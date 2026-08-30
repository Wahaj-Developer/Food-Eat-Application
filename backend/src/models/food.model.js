const mongoose = require('mongoose')


const foodSchema = new mongoose.Schema(
    {

        name: {
            type: String,
            required: true
        },


        description: {
            type: String,
            default: ''
        },


        video: {
            type: String,
            required: true
        },


        /*
         * ImageKit file ID.
         *
         * This is required when deleting
         * the video from ImageKit.
         */
        fileId: {
            type: String,
            required: true
        },


        foodPartner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'foodpartner',
            required: true
        },


        likeCount: {
            type: Number,
            default: 0
        },


        savesCount: {
            type: Number,
            default: 0
        }

    },

    {
        timestamps: true
    }
)


const foodModel = mongoose.model(
    'food',
    foodSchema
)


module.exports = foodModel