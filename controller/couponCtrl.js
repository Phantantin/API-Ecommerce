const Coupon = require('../models/couponModel');
const validateMongoDbId = require('../utils/validateMongodbld');
const asynHandler = require('express-async-handler');

const createCoupon = asynHandler(async(req, res) =>{
    try {
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon);
    } catch (error) {
        throw new Error(error);
    }
});

// get all coupon
const getAllCoupon = asynHandler(async(req, res) =>{
    try {
        const getallCoupon = await Coupon.find();
        res.json(getallCoupon);
    } catch (error) {
        throw new Error(error);
    }
});

// update coupon
const updateCoupon = asynHandler(async(req, res) =>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body,{
            new: true,
        });
        res.json(updateCoupon);
    } catch (error) {
        throw new Error(error);
    }
});

// delete coupon
const deleteCoupon = asynHandler(async(req, res) =>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const deleteCoupon = await Coupon.findByIdAndDelete(id);
        res.json(deleteCoupon);
    } catch (error) {
        throw new Error(error);
    }
});

const getCoupon = asynHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const getAcoupon = await Coupon.findById(id);
      res.json(getAcoupon);
    } catch (error) {
      throw new Error(error);
    }
  });

module.exports = {
    createCoupon,
    getAllCoupon,
    updateCoupon,
    deleteCoupon,
    getCoupon,
};