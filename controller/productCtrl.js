const Product = require('../models/productModel');
const asyncHandler = require("express-async-handler");
const slugify = require ("slugify");
const productModel = require('../models/productModel');
const validateMongodbid = require('../utils/validateMongodbid');
const User = require('../models/userModel');
const { Error } = require('mongoose');
const cloudinaryUploadImg = require('../utils/cloudinary');


//create/register product
const createProduct = asyncHandler(async(req, res) => {
try{
    if(req.body.tittle){
        req.body.slug = slugify(req.body.tittle);
    }
    const newProduct = await Product.create(req.body);

    res.json(newProduct);
}
catch(error){
    throw new Error(error);
}
});


//get a single product
const getAProduct = asyncHandler(async(req, res) => {
    const {id} = req.params;
    try{
const findProduct = await Product.findById(id);
        res.json(findProduct );
    }

    catch(error){
        throw new Error(error)
    }
});


//update product
const updateProduct = asyncHandler(async (req, res) => {

    const {id} = req.user;
       try{
            if(req.body.tittle) {
                req.body.slug = slugify(req.body.tittle);
            }
    const updateProduct = await Product.findOneAndUpdate(id , req.body, { new: true, });
    res.json(updateProduct);
            
            }catch (error) {
                throw new Error(error);
        }
    });
    

      //delete product
    const deleteProduct = asyncHandler(async (req, res) => {

        const id = req.user;
    
            try{
                 const deleteProduct = await Product.findByIdAndDelete(id);
        res.json(deleteProduct);
                
                }catch (error) {
                    throw new Error(error);
            }
        });
        


//get all product
const getAllProduct = asyncHandler(async(req, res) =>{

    try{
        //filtering
        const queryObj = { ...req.query };
        
const excludeFields = ['page', 'sort', 'limit', 'fields'];
excludeFields.forEach((el) => delete queryObj[el]);

console.log(queryObj);

// console.log(queryObj);

// const queryStr = JSON.stringify(queryObj);
// queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

// let query = Product.find(JSON.parse(queryStr));
// console.log(queryObj, req.query);

let queryStr = JSON.stringify(queryObj);
queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);


let query = Product.find (JSON.parse(queryStr));

//sorting
if(req.query.sort){
    //split query
    const sortBy =req.query.sort.split(',').join(' ');
   query = query.sort(sortBy);

}else{
    query=query.sort('-createdAt');
}

//limiting the fields
if(req.query.fields){
    const fields =req.query.fields.split(',').join(' ');
    query = query.select(fields);
}else{
query=query.select('-__v')
}

//pagination
const page = req.query.page;
const limit = req.query.limit;
const skip = (page - 1) * limit;
query = query.skip(skip).limit(limit);
if(req.query.page){
const productCount = await Product.countDocuments();
if(skip>= productCount) throw new Error('This page does not exists');
}
console.log(page, limit, skip);


const product = await query;
res.json(product)

// const Product = await query;
        res.json(getAllProduct);
    }catch(error){
        throw new Error(error);
    }
});

//Wishlist functionality
const addToWishList = asyncHandler(async(req, res) =>{
    const {_id} = req.user;
    const {prodId} = req.body;
    try{
        //get user
        const user =  await User.findById(_id);
        //check if the product is added or not.

        const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);
        if(alreadyAdded){
            let user = await User.findByIdAndUpdate(_id, {
                $pull: {wishlist: prodId},
            }, 
            {
                new: true,
            }
            );
            res.json(user);
        }else{
            let user = await User.findByIdAndUpdate(_id, {
                $push: {wishlist: prodId},
            }, 
            {
                new: true,
            }
            );
            res.json(user);
        }

    }catch(error){
        throw new Error(error);
    }
});


//product rating
const rating = asyncHandler(async(req, res) =>{
const {_id} = req.user;
const {star, prodId, comment} = req.body;
try{
const product = await Product.findById(prodId);
let alreadyRated = product.ratings.find((userId) => userId.postedby.toString() === _id.toString()
);
if(alreadyRated){

    //find the rated product
const updateRating = await Product.updateOne({
    ratings: {$elemMatch: alreadyRated},
},

{
    //set the ratings
    $set:{"ratings.$.star": star, "ratings.$.comment": comment},
}, {
    new: true,
}
);
// res.json(updateRating);
}else{
    const rateProduct = await Product.findByIdAndUpdate(prodId,{
        $push: {
            ratings:{
                star: star,
                comment: comment,
                postedby: _id,
            },
        },
    }, 
    {
        new: true,
    }
    );
    // res.json(rateProduct);
}

//create all rated functionality
 const getAllRating = await Product.findById(prodId);

 let totalRating = getAllRating.ratings.length;
 let ratingSum = getAllRating.ratings.map((item) => item.star).reduce((prev, curr) => prev + curr, 0);
let actualRating = Math.round(ratingSum / totalRating);

let finalProduct = await Product.findByIdAndUpdate(prodId, {
    totalrating: actualRating,
}, 
{
    new: true
}
);
res.json(finalProduct);
} 
catch (error) {
    console.log(error);
    throw new Error(error);
}
});



const uploadImages = asyncHandler(async(req, res) => {
//   console.log(req.files);
   const {id} = req.params;
   validateMongodbid(id);
//    console.log(req.files);
   try{
    const uploader = (path) => cloudinaryUploadImg(path, 'images');

    const urls = [];
    const files =  req.files;
    for (const file of files){
        const {path} = files;
        const newPath = await uploader(path);
      
        urls.push(newPath);
    }

    const findProduct = await Product.findByIdAndUpdate(
        id, 
        {
       images: urls.map((file)=> {
        
        return file;
       }),
    }, 
    {
        new: true,
    }
    );
    res.json(findProduct);
   }catch(error){
    throw new Error(error)
   }
});

module.exports = { createProduct, getAProduct, getAllProduct, updateProduct, deleteProduct, addToWishList, rating, uploadImages}