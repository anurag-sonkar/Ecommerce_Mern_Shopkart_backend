const express = require('express')
const app = express()
var morgan = require('morgan')
require('dotenv').config()
const db = require('./config/dbConnection')
const PORT = process.env.PORT || 5000
const authRouter = require('./routes/userAuthRoute')
const protectedRoute = require('./routes/protectedRoutes')
const productRoute = require('./routes/productRoutes')
const blogRoute = require('./routes/blogRoutes')
const productCategoryRoute = require('./routes/productCategoryRoutes')
const blogCategoryRoute = require('./routes/blogCategoryRoutes')

const path = require('path')
const authenticate = require('./middleware/authentication')

// middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(morgan())

// Middleware for serving static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// routes
app.use('/blog-category' , blogCategoryRoute)
app.use('/product-category' , productCategoryRoute)
app.use('/blog' , blogRoute)
app.use('/product' ,authenticate, productRoute)
app.use('/auth' , authRouter)
app.use('/' , authenticate ,protectedRoute)

app.listen(PORT , ()=>console.log(`Server Running at http://localhost:${PORT} `))