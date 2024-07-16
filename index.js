const express = require('express')
const app = express()
require('dotenv').config()
const db = require('./config/dbConnection')
const PORT = process.env.PORT || 5000
const authRouter = require('./routes/userAuthRoute')
const protectedRoute = require('./routes/protectedRoutes')
const productRoute = require('./routes/productRoutes')

const path = require('path')
const authenticate = require('./middleware/authentication')

// middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// Middleware for serving static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// routes
app.use('/product' ,authenticate, productRoute)
app.use('/auth' , authRouter)
app.use('/' , authenticate ,protectedRoute)


app.listen(PORT , ()=>console.log(`Server Running at http://localhost:${PORT} `))