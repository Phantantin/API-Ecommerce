const { generateToken } = require('../config/jwtToken');
const User = require('../models/useModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');
const Order = require('../models/orderModel');
const asynsHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbld');
const { generateRefreshToken } = require('../config/refreshtoken');
const jwt = require('jsonwebtoken');
const sendEmail = require('./emailCtrl');
const crypto = require('crypto');
const uniqid = require('uniqid'); 


// create a user
const createUser = asynsHandler(async(req, res) =>{
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if(!findUser){
        // create a new User
        const newUser = await User.create(req.body);
        res.json(newUser);
    }else{
        // user already exists
        throw new Error('User Already Exitst')
    }

});


// login a user
const loginUserCtrl = asynsHandler(async(req, res) =>{
    const {email, password} = req.body;
    // check if user exitst or not
    const findUser = await User.findOne({email});
    if(findUser && await findUser.isPasswordMatched(password)){
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(findUser.id, {
        refreshToken: refreshToken,
    },{
        new: true
    });
    res.cookie('refreshToken', refreshToken,{
        httpOnly: true,
        maxAge: 72 * 60 * 60 *1000,
    });
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        });
    }else{
        throw new Error("Invalid Credentals");
    }
});

// login a Admin
const loginAdmin = asynsHandler(async(req, res) =>{
    const {email, password} = req.body;
    // check if user exitst or not
    const findAdmin = await User.findOne({email});
    if(findAdmin.role !== "admin") throw new Error("Not Authorised");
    if(findAdmin && await findAdmin.isPasswordMatched(password)){
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateuser = await User.findByIdAndUpdate(findAdmin.id, {
        refreshToken: refreshToken,
    },{
        new: true
    });
    res.cookie('refreshToken', refreshToken,{
        httpOnly: true,
        maxAge: 72 * 60 * 60 *1000,
    });
        res.json({
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id),
        });
    }else{
        throw new Error("Invalid Credentals");
    }
});

// save user address
const saveAddress = asynsHandler(async( req, res) =>{
    const {_id} = req.user;
    validateMongoDbId(_id);
    try{
        const updatedUser = await User.findByIdAndUpdate(_id, {
            address: req?.body?.address,
        },{
            new : true,
        });
        res.json(updatedUser)
    }catch(error){
        throw new Error(error);
    }
});

// get all users
const getallUser = asynsHandler(async(req, res) =>{
    try{
        const getUsers = await User.find();
        res.json(getUsers);
    }catch(error){
        throw new Error(error);
    }
});

// handle refresh token
const handleRefreshToken = asynsHandler( async(req, res) =>{
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error('No refresh Token in Cookies');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if(!user) throw new Error('No Refresh token present in db or not matched');
    jwt.verify(refreshToken, process.env.JWT_SECRET,(err, decoded) =>{
        if(err || user.id !== decoded.id){
            throw new Error('There is something wrong with refresh token');
        }
        const accessToken = generateToken(user?._id);
        res.json({accessToken});
    });
});

// logout functionality
const logout = asynsHandler(async(req, res)=>{
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error('No refresh Token in Cookies');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if(!user){
        res.clearCookie("refreshToken",{
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204);  // forbidden
    }
    User.findOneAndUpdate(refreshToken,{
        refreshToken: "",
    });
    res.clearCookie("refreshToken",{
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204);  // forbidden
});

// update a user
const updatedUser = asynsHandler(async(req, res) =>{
    const {_id} = req.user;
    validateMongoDbId(_id);
    try{
        const updatedUser = await User.findByIdAndUpdate(_id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,

        },{
            new : true,
        });
        res.json(updatedUser)
    }catch(error){
        throw new Error(error);
    }
})

// get a single user
const getaUser = asynsHandler(async(req, res) =>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const getaUser = await User.findById(id);
        res.json({
            getaUser, 
        })
    }catch(error){
        throw new Error(error);
    }
});


// delete a user
const deleteaUser = asynsHandler(async(req, res) =>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const deleteaUser = await User.findByIdAndDelete(id);
        res.json({
            deleteaUser, 
        })
    }catch(error){
        throw new Error(error);
    }
});


const blockUser = asynsHandler(async (req, res) =>{
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const blockUser = await User.findByIdAndUpdate(id,{
            isBlocked: true,
        },{
            new: true,
        });
        res.json(blockUser);
    }catch(error){
        throw new Error(error);
    }
});
const unblockUser = asynsHandler(async (req, res) =>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const unblockUser = await User.findByIdAndUpdate(id,{
            isBlocked: false,
        },{
            new: true,
        });
        res.json(unblockUser);
    }catch(error){
        throw new Error(error);
    }
});

const updatePassword = asynsHandler(async (req, res) =>{
    const {_id} = req.user;
    const {password} = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if(password){
        user.password = password;
        const updatePassword = await user.save();
        res.json(updatePassword);
    }else{
        res.json(user);
    }
});

const forgotPasswordToken = asynsHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found with this email");
    try {
      const token = await user.createPasswordResetToken();
      await user.save();
      const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:3000/reset-password/${token}'>Click Here</>`;
      const data = {
        to: email,
        text: "Hey User",
        subject: "Forgot Password Link",
        htm: resetURL,
      };
      sendEmail(data);
      res.json(token);
    } catch (error) {
      throw new Error(error);
    }
});

//
const resetPassword = asynsHandler(async(req,res) =>{
    const {password} = req.body;
    const {token} = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now()},
    });
    if(!user) throw new Error(" Token expired, Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
});

//
const getWishlist = asynsHandler(async(req, res) =>{
    const {_id} = req.user;
    console.log(req.user);
    try {
        const findUser = await User.findById(_id).populate("wishlist");
        res.json(findUser);
    } catch (error) {
        throw new Error(error);
    }
});

// 
const userCart = asynsHandler(async (req, res) => {
    const { productId, color, quantity, price } = req.body;
    const {_id} = req.user;
    validateMongoDbId(_id);
    try {
      
      let newCart = await new Cart({
        userId: _id,
        productId,
        color,
        price,
        quantity
      }).save();
      res.json(newCart);
    } catch (error) {
      throw new Error(error);
    }
});

//
const getUserCart = asynsHandler(async(req, res)=>{
    const {_id} = req.user;
    validateMongoDbId(_id);
    try {
        const cart = await Cart.find({ userId: _id}).populate(
            "productId",
        ).populate("color");
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
});

//
const removeProductFromCart = asynsHandler(async(req, res)=>{
    const {_id} = req.user;
    const {cartItemId} = req.params;
    validateMongoDbId(_id);
    try {
        const deleteProductFromCart = await Cart.deleteOne({userId:_id, _id:cartItemId})
        res.json(deleteProductFromCart);
    } catch (error) {
        throw new Error(error);
    }
});

//
const updateProductQuantityFromCart = asynsHandler(async(req, res)=>{
    const {_id} = req.user;
    const {cartItemId, newQuantity} = req.params;
    validateMongoDbId(_id);
    try {
        const cartItem = await Cart.findOne({userId:_id, _id:cartItemId});
        cartItem.quantity = newQuantity
        cartItem.save();
        res.json(cartItem);
    } catch (error) {
        throw new Error(error);
    }
});

const createOrder = asynsHandler(async(req,res)=>{
    const {shippingInfo,month, totalPrice, orderItems, totalPriceAfterDiscount, paymentInfo} = req.body;
    const {_id} = req.user;
    try {
        const order= await Order.create({
            shippingInfo,month, orderItems, totalPrice, totalPriceAfterDiscount, paymentInfo, user: _id
        });
        res.json({
            order,
            success: true
        })
    } catch (error) {
        throw new Error(error);
    }
})


// 
const getMyOrders = asynsHandler(async(req, res)=>{
    const { _id } = req.user;
    try{
        const orders = await Order. find({user:_id}).populate("user").populate("orderItems.product").populate("orderItems.color")

        res.json({
            orders
        })

    }catch(error){
        throw new Error(error)
    }
});

const getAllOrders = asynsHandler(async(req, res) =>{
    try {
        const orders = await Order.find().populate("user")
        
        res.json({orders});
    } catch (error) {
        throw new Error(error);
    }
});

//
const getSingleOrders = asynsHandler(async(req, res) =>{
    const {id} = req.params
    try {
        const orders = await Order.findOne({_id:id})
        .populate("orderItems.product")
        .populate("orderItems.color")
        
        res.json({orders});
    } catch (error) {
        throw new Error(error);
    }
});

//
const updateOrder = asynsHandler(async(req, res) =>{
    const {id} = req.params
    try {
        const orders = await Order.findById(id)
        orders.orderStatus = req.body.status;
        await orders.save()        
        res.json({orders});
    } catch (error) {
        throw new Error(error);
    }
});

// 
const getMonthWiseOrderIncome = asynsHandler(async(req, res)=>{
    let monthNames= ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];
    let d = new Date();
    let endDate = "";
    d.setDate(1)
    for (let index = 0; index < 11; index++) {
        d.setMonth(d.getMonth() -1)
        endDate = monthNames[d.getMonth()]+ " " + d.getFullYear()
        
    }
    const data = await Order.aggregate([
        {
            $match:{
                createdAt:{
                    $lte: new Date(),
                    $gte : new Date(endDate)
                }
            }
        },{
            $group: {
                _id: {
                    month: "$month"
                },amount:{$sum:"$totalPriceAfterDiscount"},count:{$sum:1}
            }
        }
    ]) 
    res.json(data)
})

//
// const getMonthWiseOrderCount = asynsHandler(async(req, res)=>{
//     let monthNames= ["January","February","March","April","May","June","July",
//             "August","September","October","November","December"];
//     let d = new Date();
//     let endDate = "";
//     d.setDate(1)
//     for (let index = 0; index < 11; index++) {
//         d.setMonth(d.getMonth() -1)
//         endDate = monthNames[d.getMonth()]+ " " + d.getFullYear()
        
//     }
//     const data = await Order.aggregate([
//         {
//             $match:{
//                 createdAt:{
//                     $lte: new Date(),
//                     $gte : new Date(endDate)
//                 }
//             }
//         },{
//             $group: {
//                 _id: {
//                     month: "$month"
//                 },count:{$sum:1}
//             }
//         }
//     ]) 
//     res.json(data)
// })

//
const getYearlyTotalOrders= asynsHandler(async(req, res)=>{
    let monthNames= ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];
    let d = new Date();
    let endDate = "";
    d.setDate(1)
    for (let index = 0; index < 11; index++) {
        d.setMonth(d.getMonth() -1)
        endDate = monthNames[d.getMonth()]+ " " + d.getFullYear()
        
    }
    const data = await Order.aggregate([
        {
            $match:{
                createdAt:{
                    $lte: new Date(),
                    $gte: new Date(endDate)
                }
            }
        },{
            $group: {
                _id: null,
                count:{$sum:1},
                amount:{$sum: "$totalPriceAfterDiscount"}
            }
        }
    ]) 
    res.json(data)
})



// 
// const emptyCart = asynsHandler(async(req, res) =>{
//     const {_id} = req.user;
//     validateMongoDbId(_id);
//     try {
//         const user = await User.findOne({_id});
//         const cart = await Cart.findOneAndRemove({orderby: user._id});
//         res.json(cart);
//     } catch (error) {
//         throw new Error(error);
//     }
// });

// //
// const applyCoupon = asynsHandler(async(req, res)=>{
//     const {coupon} = req.body;
//     const {_id} = req.user;
//     validateMongoDbId(_id);
//     const validConpon = await Coupon.findOne({name: coupon});
//     if(validConpon === null){
//         throw new Error("Invalid Coupon");
//     }
//     const user = await User.findOne({_id});
//     let {cartTotal} = await Cart.findOne({orderby: user._id,})
//     .populate("products.product");
//     let totalAfterDiscount = (cartTotal - (cartTotal * validConpon.discount)/100).toFixed(2);
//     await Cart.findOneAndUpdate(
//         {orderby: user._id},
//         {totalAfterDiscount},
//         {new: true}
//     );
//     res.json(totalAfterDiscount);
// });

// //
// const createOrder = asynsHandler(async(req, res) =>{
//     const {COD, couponApplied} = req.body;
//     const {_id} = req.user;
//     validateMongoDbId(_id);
//     try {
//         if(!COD) throw new Error("Create cash order faile");
//         const user = await User.findById(_id);
//         let userCart = await Cart.findOne({orderby:user._id});
//         let finalAmout = 0;
//         if(couponApplied && userCart.totalAfterDiscount){
//             finalAmout = userCart.totalAfterDiscount;
//         }else{
//             finalAmout = userCart.cartTotal;
//         }
//         let newOrder = await new Order({
//             products: userCart.products,
//             paymentIntent: {
//             id: uniqid(),
//             method: "COD",
//             amount: finalAmout,
//             status: "Cash on Delivery",
//             created: Date.now(),
//             currency: "usd",
//             },
//             orderby: user._id,
//             orderStatus: "Cash on Delivery",
//         }).save();
//         let update = userCart.products.map((item) =>{
//             return {
//                 updateOne: {
//                     filter: {_id: item.product._id},
//                     update: {$inc: {quantity: -item.count, sold: +item.count}},
//                 },
//             };
//         });
//         const updated = await Product.bulkWrite(update, {});
//         res.json({message: "success"});
//     } catch (error) {
//         throw new Error(error);
//     }
// });

// // 
// const getOrders = asynsHandler(async(req, res) =>{
//     const {_id} = req.user;
//     validateMongoDbId(_id);
//     try {
//         const userorders = await Order.findOne({orderby: _id})
//         .populate("products.product")
//         .populate("orderby")
//         .exec();
//         res.json(userorders);
//     } catch (error) {
//         throw new Error(error);
//     }
// });

// const getAllOrders = asynsHandler(async(req, res) =>{
//     try {
//         const alluserorders = await Order.find()
//         .populate("products.product")
//         .populate("orderby")
//         .exec();
//         res.json(alluserorders);
//     } catch (error) {
//         throw new Error(error);
//     }
// });

// const getOrderByUserId = asynsHandler(async(req, res) =>{
//     const {id} = req.params;
//     validateMongoDbId(id);
//     try {
//         const userorders = await Order.findOne({orderby: id})
//         .populate("products.product")
//         .populate("orderby")
//         .exec();
//         res.json(userorders);
//     } catch (error) {
//         throw new Error(error);
//     }
// });

// const updateOrderStatus = asynsHandler(async(req, res)=>{
//     const {status} = req.body;
//     const {id} = req.params;
//     validateMongoDbId(id);
//     try {
//         const updateOrderStatus = await Order.findByIdAndUpdate(id,
//             {
//                 orderStatus: status,
//                 paymentIntent: {
//                     status: status,
//                 }
//             },
//             {new: true}
//         );
//         res.json(updateOrderStatus);
//     } catch (error) {
//         throw new Error(error);
//     }
// });

module.exports = { 
    createUser, 
    loginUserCtrl, 
    getallUser, 
    getaUser, 
    deleteaUser,
    updatedUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    loginAdmin,
    getWishlist,
    saveAddress,
    userCart,
    getUserCart,
    // emptyCart,
    // applyCoupon,
    // createOrder,
    // getOrders,
    // getAllOrders,
    // updateOrderStatus,
    // getOrderByUserId,
    createOrder,
    removeProductFromCart,
    updateProductQuantityFromCart,
    getMyOrders,
    getMonthWiseOrderIncome,
    // getMonthWiseOrderCount,
    getYearlyTotalOrders,
    getAllOrders,
    getSingleOrders,
    updateOrder
};