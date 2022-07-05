const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema(
    {
    username: {
        type: String,
        required: true,  //必須項目
        min: 3,
        max: 25,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 50,
    },
    profilePicture: {
        type: String,  //パスを入れるのでstring
        default:'',
    },
    coverPicture: {
        type: String,  
        default:'', 
    },
    followers: {
        type: Array,
        default:[],
        },
        followings: {
            type: Array,
            default:[],      
    },
    isAdmin: {
        type: Boolean,
        default:false,   //デフォルト値
    },
    desc: {             //desctiption
        type: String,
        max:70,
    },
    city: {
        type: String,
        max:50,
    },
    },
    
{ timestamps : true }    //データを登録した日時を自動で格納する

);

module.exports = mongoose.model('User', UserSchema);