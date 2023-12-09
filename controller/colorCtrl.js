const Color = require('../models/colorModel');
const asynsHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbld');


//[POST]  createColor
const createColor = asynsHandler(async(req, res)=>{
    try {
        const newColor = await Color.create(req.body);
        res.json(newColor);
    } catch (error) {
        throw new Error(error);
    }
});

//[PUT]  updateColor
const updateColor = asynsHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const updateColor = await Color.findByIdAndUpdate(id, req.body,{
            new: true
        });
        res.json(updateColor);
    } catch (error) {
        throw new Error(error);
    }
});


//[DELETE]  deleteColor
const deleteColor = asynsHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const deleteColor = await Color.findByIdAndDelete(id);
        res.json(deleteColor);
    } catch (error) {
        throw new Error(error);
    }
});

// [GET] get Color
const getColor = asynsHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const getaColor = await Color.findById(id);
        res.json(getaColor);
    } catch (error) {
        throw new Error(error);
    }
});

// [GET] get Color
const getallColor = asynsHandler(async(req, res)=>{
    try {
        const getallColor = await Color.find();
        res.json(getallColor);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createColor,
    updateColor,
    deleteColor,
    getColor,
    getallColor,
};