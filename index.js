const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const db = require('./config/dbConnection')
const PORT = process.env.PORT || 5000
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

const path = require('path')
const authenticate = require('./middleware/authentication')
{/* temp */}
const { checkout, paymentVerification } = require('./controllers/paymentCtrl')


// middleware
app.use(cors({
    // origin: 'http://192.168.43.196:3000', // Replace with react frontend URL
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow necessary methods
    credentials: true // If you need to include cookies
  }));
  
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(morgan())

// Middleware for serving static files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



{/* temp */}
app.post('/checkout' ,authenticate, checkout)
app.post('/paymentVerification' ,authenticate, paymentVerification)
// routes
app.use('/address' , authenticate, addressRoute)
app.use('/enquiry' , enquiryRoute)
app.use('/coupon' , couponRoute)
app.use('/color' , colorRoute)
app.use('/brand' , brandRoute)
app.use('/blog-category' , blogCategoryRoute)
app.use('/product-category' , productCategoryRoute)
app.use('/blog' , blogRoute)
app.use('/product', productRoute)
app.use('/auth' , authRouter)
app.use('/' , authenticate ,protectedRoute)





app.listen(PORT , ()=>console.log(`Server Running at http://localhost:${PORT}`))