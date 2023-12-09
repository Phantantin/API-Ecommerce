const Enquiry = require('../models/enpModel');
const asynsHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbld');


//[POST]  createEnquiry
const createEnquiry = asynsHandler(async(req, res)=>{
    try {
        const newEnquiry = await Enquiry.create(req.body);
        res.json(newEnquiry);
    } catch (error) {
        throw new Error(error);
    }
});

//[PUT]  updateEnquiry
const updateEnquiry = asynsHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const updateEnquiry = await Enquiry.findByIdAndUpdate(id, req.body,{
            new: true
        });
        res.json(updateEnquiry);
    } catch (error) {
        throw new Error(error);
    }
});


//[DELETE]  deleteEnquiry
const deleteEnquiry = asynsHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const deleteEnquiry = await Enquiry.findByIdAndDelete(id);
        res.json(deleteEnquiry);
    } catch (error) {
        throw new Error(error);
    }
});

// [GET] get Enquiry
const getEnquiry = asynsHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const getaEnquiry = await Enquiry.findById(id);
        res.json(getaEnquiry);
    } catch (error) {
        throw new Error(error);
    }
});

// [GET] get Enquiry
const getallEnquiry = asynsHandler(async(req, res)=>{
    try {
        const getallEnquiry = await Enquiry.find();
        res.json(getallEnquiry);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createEnquiry,
    updateEnquiry,
    deleteEnquiry,
    getEnquiry,
    getallEnquiry,
};