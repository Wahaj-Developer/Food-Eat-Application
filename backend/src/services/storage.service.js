const ImageKit = require('@imagekit/nodejs')
const { toFile } = require('@imagekit/nodejs')


const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})


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

/**
 * =========================================
 * GET UPLOAD CREDENTIALS
 * =========================================
 *
 * Generates short-lived credentials so the
 * browser can upload directly to ImageKit.
 */

function getUploadAuthParams() {

    const authParams =
        client.helper.getAuthenticationParameters()


    return {

        ...authParams,

        publicKey:
            process.env.IMAGEKIT_PUBLIC_KEY

    }

}

module.exports = {
    uploadFile,
    deleteFile,
    getUploadAuthParams
}
