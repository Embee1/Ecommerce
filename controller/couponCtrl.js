const expressAsyncHandler = require("express-async-handler");
const Coupon = require("../models/couponModel");
const validateMongodbid = require('../utils/validateMongodbid');
const asyncHandler =require("express-async-handler");

//Register coupon
const CreateCoupon = asyncHandler(async (req, res) => {

    try{
const newCoupon = await Coupon.create(req.body);
res.json(newCoupon);
}
    catch(error){
        throw new Error(error);
    }
});


//Get All Coupons
const getAllCoupons = asyncHandler(async (req, res) => {

    try{
const coupons = await Coupon.find();
res.json(coupons);
}
    catch(error){
        throw new Error(error);
    }
})

//Get A coupon
const getACoupon = asyncHandler(async(req, res) =>{
    const {id} = req.params;
    try{
const aCoupon = await Coupon.findById(id)

res.json(aCoupon);
    } 

    catch(error){
        throw new Error(error);
    }

})

//update Coupon
const updateCoupon = asyncHandler(async(req, res) =>{
    const {id} = req.params;
    validateMongodbid(id);

   try{
    const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
        new: true
    })
    res.json(updateCoupon);
   }catch(error){
    throw new Error(error)
}
})


//deletCoupon
const deleteCoupon = asyncHandler(async(req, res) =>{
    const {id} = req.params;
    validateMongodbid(id);

   try{
    const deleteCoupon = await Coupon.findByIdAndDelete(id, req.body, {
        new: true
    })
    res.json(deleteCoupon);
   }catch(error){
    throw new Error(error)
}
})




module.exports = {CreateCoupon, getAllCoupons, getACoupon, updateCoupon, deleteCoupon};
