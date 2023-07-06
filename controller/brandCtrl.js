const Brand = require('../models/brandModel');
const asyncHandler =require('express-async-handler');
const validateMongodbid = require('../utils/validateMongodbid');

//Add product brand
const createBrand = asyncHandler(async(req, res) => {
    try{
        const newBrand = await Brand.create(req.body);
        res.json(newBrand)
    }catch(error){
        throw new Error(error);
    }
});

//update Product Brand
const updateBrand = asyncHandler(async(req, res) => {
     const {id} = req.params;
    validateMongodbid(id);

try{
    const updateBrand = await Brand.findByIdAndUpdate(id, req.body, {new: true,
    });
    res.json(updateBrand)
}catch(error){
    throw new Error(error)
}





    // try{
    //     const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
    //         new: true,
    //     });
    //     res.json(updatedBrand);
    // }catch(error){
    //     throw new Error(error);
    // }
});

//delete Brand
const deleteBrand = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongodbid(id);
    try{
        const deleteBrand = await Brand.findByIdAndDelete(id);
        res.json(deleteBrand);
    }catch(error){
        throw new Error(error);
    }
});


//get a catyegory
const getABrand = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongodbid(id);
    try{
        const getBrand = await Brand.findById(id);
        res.json(getBrand);
    }catch(error){
        throw new Error(error);
    }
});

//get All Brand
const getAllBrand = asyncHandler(async(req, res) => {

    try{
        const getAllBrand = await Brand.find();
        res.json(getAllBrand);
    }catch(error){
        throw new Error(error);
    }
});


module.exports = {createBrand , updateBrand, deleteBrand, getABrand,  getAllBrand
};