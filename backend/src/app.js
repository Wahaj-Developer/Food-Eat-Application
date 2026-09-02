const express = require('express')
const cookieParser =require('cookie-parser')
const authRoutes =require('./routes/auth.routes')
const foodRoutes =require('./routes/food.routes')
const foodPartnerRoutes = require('./routes/foodpartner.routes')
const cors = require('cors')


const app = express()



app.set('etag', false)

app.use((req, res, next) => {

    res.set(
        'Cache-Control',
        'no-store'
    )

    next()

})


app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true
}))
app.use(cookieParser())
app.use(express.json())



app.use("/api/auth",authRoutes)
app.use("/api/food",foodRoutes)
app.use("/api/foodpartner",foodPartnerRoutes)

module.exports = app;


app.use("/api/auth",authRoutes)
app.use("/api/food",foodRoutes)
app.use("/api/foodpartner",foodPartnerRoutes)

module.exports = app;
