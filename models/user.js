const mongoose = require('mongoose'); 
// mdbgum - snnipet
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    cpassword:{
        type:String,
        required:true,
    },
    imgpath:{
        type:String,
        default:null
    },
    date:{
        type:Date,
        default:Date.now
    },
});

const USER = mongoose.model('User', userSchema);

//Export the model
module.exports = USER