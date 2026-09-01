const mongoose = require('mongoose')


let connectionPromise = null


function connectDB() {

    if (!connectionPromise) {

        connectionPromise =
            mongoose.connect(
                process.env.MONGODB_URI
            )
            .then(() => {

                console.log('MongoDB is connected')
                console.log('Everything is clear sir.')

                return mongoose.connection

            })
            .catch((error) => {

                console.log(
                    'Mongodb connection error is:',
                    error
                )

                connectionPromise = null

                throw error

            })

    }

    return connectionPromise

}


module.exports = connectDB
