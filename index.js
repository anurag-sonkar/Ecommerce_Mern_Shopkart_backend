const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const db = require('./config/dbConnection')
const PORT = process.env.PORT || 8000
const BASE_URL = process.env.BASE_URL
const authRouter = require('./routes/userAuthRoute')
const protectedRoute = require('./routes/protectedRoutes')
const productRoute = require('./routes/productRoutes')
const blogRoute = require('./routes/blogRoutes')
const productCategoryRoute = require('./routes/productCategoryRoutes')
const blogCategoryRoute = require('./routes/blogCategoryRoutes')
const brandRoute = require('./routes/bandRoutes')
const colorRoute = require('./routes/colorRoutes')
const couponRoute = require('./routes/couponRoutes')
const enquiryRoute = require('./routes/enquiryRoutes')
const addressRoute = require('./routes/AddressRoutes')
const orderRoute = require('./routes/orderRoutes')
const { checkout, paymentVerification } = require('./controllers/paymentCtrl')

const path = require('path')
const authenticate = require('./middleware/authentication')


// middleware
app.use(cors({
    // origin: '192.168.43.195:3000', // Replace with react frontend URL
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow necessary methods
    // credentials: true // If you need to include cookies
  }));
  
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(morgan())

// Middleware for serving static files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// routes
app.use('/auth' , authRouter)
app.post('/checkout' ,authenticate, checkout)
app.post('/paymentVerification' ,authenticate, paymentVerification)
app.use('/address' , authenticate, addressRoute)
app.use('/order',authenticate, orderRoute)
app.use('/enquiry' , enquiryRoute)
app.use('/coupon' , couponRoute)
app.use('/color' , colorRoute)
app.use('/brand' , brandRoute)
app.use('/blog-category' , blogCategoryRoute)
app.use('/product-category' , productCategoryRoute)
app.use('/blog' , blogRoute)
app.use('/product', productRoute)
app.use('/' , authenticate ,protectedRoute)





app.listen(PORT , ()=>console.log(`Server Running at http://localhost:${PORT}`))
// app.listen(PORT , ()=>console.log(`Server Running at ${BASE_URL}:${PORT}`))