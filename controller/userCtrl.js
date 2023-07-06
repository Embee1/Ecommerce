 const { generateToken } = require('../config/jwtToken');
 const User = require('../models/userModel');
const asyncHandler=require('express-async-handler');
 const validateMongodbid = require('../utils/validateMongodbid');
 const { generateRefreshToken } = require('../config/refreshToken');

const crypto = require('crypto');
 const { JsonWebTokenError } = require('jsonwebtoken');
generateRefreshToken
const jwt= require("jsonwebtoken");
 const sendEmail = require('./emailCtrl');


//register user
const createUser = asyncHandler(async  (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({email: email});
    
    if(!findUser){
        //create a new user
    
        const newUser = await User.create(req.body);
        res.json(newUser);
    }else{
        //user already exists
        throw new Error('User Already Exist')
    }
    });



    //login controller

    const loginUserCtrl = asyncHandler(async(req, res) => {
      const{email, password} =req.body;
      //check if user exist or not
      const findUser=await User.findOne({email});
      if(findUser && await findUser.isPasswordMatched(password)){
const refreshToken = await generateRefreshToken(findUser?._id);
const updateUser = await User.findByIdAndUpdate(findUser.id,
     {
    refreshToken: refreshToken,
} ,
{
    new: true
});
res.cookie('refreshToken', refreshToken,{
httpOnly: true,
maxAge: 24 * 60 * 60 * 1000,
},
)
res.json(
    {
    _id: findUser?._id,
    firstname:findUser?.firstname,
    lastname:findUser?.lastname,
    email:findUser?.email,
    mobile:findUser?.mobile,
    token:generateToken(findUser?._id),
}
);
        }else{
            throw new Error("Invalid Credentials")
        }
    });


    //Get all users
    const getallUser = asyncHandler(async(req, res) =>{
try{
    const getUsers= await User.find();
    res.json(getUsers)
}catch(error){
    throw new Error(error)
}
});

//personal get all users
const getAll = asyncHandler(async(req, res) => {
    try{
        const user = await user.find()
        res.json(user)
    }catch(error){
        throw new Error(error)
    }
})


//get a single user
const getOneUser = asyncHandler(async(req, res) => {
    const {id} = req.params;
 validateMongodbid(id);

    try{
        const getOneUser = await User.findById(id);
        res.json({getOneUser});
    }catch (error){
        throw new Error(error);
    }
});

//getOne personal
const getOne = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongodbid(id);
    try{
        const getOne = await User.findById(id);
        res.json(getOne);
    }catch(error){
        throw new Error(error)
    }
})


//block a user
const blockUser = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongodbid(id);
    try{
        const block=await User.findByIdAndUpdate(id, 
            {
            isBlocked: true
        },
            {
                new: true
            }
            ); 
            res.json(block);
    }catch(error){
        throw new Error(error)
    }
});


//unblock User
const unblockUser = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongodbid(id);
    try{
        const unblock= await User.findByIdAndUpdate(
            id, 
            {
                isBlocked: false
            },
            {
                new: true
            });
            res.json(unblock);
    }catch(error){
        throw new Error(error)
    }
});



//delete a user
const deleteOneUser = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongodbid(id);
    try{
        const deleteOneUser = await User.findByIdAndDelete(id);
        res.json({deleteOneUser});
    }catch (error){
        throw new Error(error);
    }
});

//handle refresh token
const handleRefreshToken = asyncHandler(async(req, res) => {
const cookie = req.cookies;

if(!cookie?.refreshToken)
    throw new Error('no refresh token in cookies');
    const refreshToken = cookie.refreshToken;
    console.log(refreshToken );
const user = await User.findOne({
    refreshToken});
    if(!user)
    throw new Error("No refresh token isn't in db or not matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err,  decoded) =>{
         if(err || user.id !== decoded.id){
            throw new Error('There is something wrong with refresh token')
         }
       const accessToken = generateToken(user?._id);
       res.json({accessToken})
    }) 
});

//logout functionality
const logout = asyncHandler(async(req, res) => {
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error("No refresh Token in cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if(!user){
        res.clearCookie('refreshToken', {
            httpOnly:true,
            secure: true,
        })
        return res.sendStatus(204); //forbidden
    }
    await User.findOneAndUpdate(refreshToken, {
        refreshToken: "",
    });
    res.clearCookie('refreshToken', {
        httpOnly:true,
        secure: true,
    });
    res.sendStatus(204); //forbidden
});

//update user
const updateAUser = asyncHandler(async(req, res) =>{
   
    const {_id} = req.user;
    validateMongodbid(_id);
    try{
const updateUser = await User.findOneAndUpdate(_id, {
    firstname: req?.body?.firstname,
    lastname: req?.body?.lastname,
    email:req?.body?.email,
    mobile:req?.body?.mobile,
}, {
    new: true,
}
);
res.json(updateUser)
    }catch(error){
        throw new Error(error)
    }
});


//change password
const updatePassword = asyncHandler(async(req, res) => {
    
    const { _id } = req.user;
    const { password} = req.body;
    validateMongodbid(_id);
    const user = await User.findById(_id);
    if(password){
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
    }else{
        res.json(user);
    }
});


//forgotPassword functionality

//check again
const forgotPasswordToken = asyncHandler(async(req, res) =>{

    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user) throw new Error('User not found with this email');
    try{
    const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Hi, please follow this link to reset your password. This link is valid till 10 minutes from now. <a href= 'http://localhost:5000/api/user/reset-password/${token}'>Click Here</>`;

        const data = {
            to: email, 
            text: 'Hey User',
            subject: "Forgot Password Link",
            html: resetURL,
        };

        sendEmail(data);
        res.json(token);`13223`
    }catch(error){
        throw new Error(error);
    }
});

//Reset password
const resetPassword = asyncHandler(async(req, res) =>{
    const {password} = req.body;
    const {token} = req.params;
    const hashToken =crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: {$gt: Date.now()
    },
    });
    if(!user) throw new Error('Token Expired, please try again later');
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
await user.save();
res.json(user);
});

module.exports = {createUser, loginUserCtrl, getallUser, getOneUser, deleteOneUser, updateAUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword};





