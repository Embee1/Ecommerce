const PCategory = require('../models/productcategoryModel');
const asyncHandler =require('express-async-handler');
const validateMongodbid = require('../utils/validateMongodbid');


//Add product category
const createCategory = asyncHandler(async(req, res) => {
    try{
        const newCategory = await PCategory.create(req.body);
        res.json(newCategory)
    }catch(error){
        throw new Error(error);
    }
});

//update Product Category
const updateCategory = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongodbid(id);
    try{
        const updateCategory = await PCategory.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(updateCategory)
    }catch(error){
        throw new Error(error);
    }
});

//delete Category
const deleteCategory = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongodbid(id);
    try{
        const deleteCategory = await PCategory.findByIdAndDelete(id);
        res.json(deleteCategory);
    }catch(error){
        throw new Error(error);
    }
});


//get a catyegory
const getACategory = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongodbid(id);
    try{
        const getCategory = await PCategory.findById(id);
        res.json(getCategory);
    }catch(error){
        throw new Error(error);
    }
});

//get All Category
const getAllCategory = asyncHandler(async(req, res) => {

    try{
        const getAllCategory = await PCategory.find();
        res.json(getAllCategory);
    }catch(error){
        throw new Error(error);
    }
});


module.exports = {createCategory , updateCategory, deleteCategory, getACategory,  getAllCategory
};