const mongoose =require('mongoose')


function connectDB(){
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
   console.log("MongoDB is connected")
   console.log("Everything is clear sir.")
    })
    .catch((error)=>{
        console.log("Mongodb connection error is:",error)
        
    })
}

module.exports = connectDB