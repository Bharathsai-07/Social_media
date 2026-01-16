import mongoose from 'mongoose'

const userSchema=new mongoose.Schema({
    _id:{type:String , requires: true},
    email:{type:String , requires: true},
    full_name:{type:String , requires: true},
    username:{type:String , requires: true},
    bio:{type:String , default:'hey there i am using this social media'},
    profile_picture:{type:String , default:''},
    cover_photo:{type:String , default:''},
    location:{type:String , default:''},
    followers:[{type:String , ref:'User'}],
    following:[{type:String , ref:'User'}],
    connections:[{type:String , ref:'User'}],
},{timestamps:true , minimize:false})

const User=mongoose.model('User',userSchema)

export default User