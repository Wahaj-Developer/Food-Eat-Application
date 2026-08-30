const ImageKit = require('@imagekit/nodejs')
const { toFile } = require('@imagekit/nodejs')


const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})


/**
 * =========================================
 * UPLOAD FILE
 * =========================================
 */

async function uploadFile(file, fileName) {

    const result =
        await client.files.upload({

            file:
                await toFile(
                    file,
                    fileName
                ),

            fileName:
                fileName

        })


    return result
}


/**
 * =========================================
 * DELETE FILE
 * =========================================
 *
 * Deletes the file from ImageKit.
 */

async function deleteFile(fileId) {

    if (!fileId) {

        throw new Error(
            'ImageKit file ID is required'
        )

    }


    const result =
        await client.files.delete(
            fileId
        )


    return result
}


module.exports = {

    uploadFile,

    deleteFile

}