const Brand = require('../models/brandModel');
const asynsHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbld');


//[POST]  createBrand
const createBrand = asynsHandler(async(req, res)=>{
    try {
        const newBrand = await Brand.create(req.body);
        res.json(newBrand);
    } catch (error) {
        throw new Error(error);
    }
});

//[PUT]  updateBrand
const updateBrand = asynsHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const updateBrand = await Brand.findByIdAndUpdate(id, req.body,{
            new: true
        });
        res.json(updateBrand);
    } catch (error) {
        throw new Error(error);
    }
});


//[DELETE]  deleteBrand
const deleteBrand = asynsHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const deleteBrand = await Brand.findByIdAndDelete(id);
        res.json(deleteBrand);
    } catch (error) {
        throw new Error(error);
    }
});

// [GET] get Brand
const getBrand = asynsHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const getaBrand = await Brand.findById(id);
        res.json(getaBrand);
    } catch (error) {
        throw new Error(error);
    }
});

// [GET] get Brand
const getallBrand = asynsHandler(async(req, res)=>{
    try {
        const getallBrand = await Brand.find();
        res.json(getallBrand);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createBrand,
    updateBrand,
    deleteBrand,
    getBrand,
    getallBrand,
};