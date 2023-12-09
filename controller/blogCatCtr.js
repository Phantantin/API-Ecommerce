const Category = require('../models/blogCatModel');
const asynsHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbld');


//[POST]  createCategory
const createCategory = asynsHandler(async(req, res)=>{
    try {
        const newCategory = await Category.create(req.body);
        res.json(newCategory);
    } catch (error) {
        throw new Error(error);
    }
});

//[PUT]  updateCategory
const updateCategory = asynsHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const updateCategory = await Category.findByIdAndUpdate(id, req.body,{
            new: true
        });
        res.json(updateCategory);
    } catch (error) {
        throw new Error(error);
    }
});


//[DELETE]  deleteCategory
const deleteCategory = asynsHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const deleteCategory = await Category.findByIdAndDelete(id);
        res.json(deleteCategory);
    } catch (error) {
        throw new Error(error);
    }
});

// [GET] get category
const getCategory = asynsHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const getaCategory = await Category.findById(id);
        res.json(getaCategory);
    } catch (error) {
        throw new Error(error);
    }
});

// [GET] get category
const getallCategory = asynsHandler(async(req, res)=>{
    try {
        const getallCategory = await Category.find();
        res.json(getallCategory);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getallCategory,
};