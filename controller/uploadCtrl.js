const {cloudinaryUploadImg, cloudinaryDeleteImg} = require('../utils/cloudinary');
const fs = require('fs');
const asyncHandler = require('express-async-handler');


const uploadImages = async (req, res) => {
    try {
        const files = req.files;
        const uploadedImages = [];

        for (const file of files) {
            const { path } = file;
            const uploadedImage = await cloudinaryUploadImg(path);
            uploadedImages.push(uploadedImage);
            fs.unlinkSync(path); // Xóa file sau khi đã upload lên Cloudinary
        }

        res.json(uploadedImages);
    } catch (error) {
        res.status(500).json({ message: 'Error uploading images' });
    }
};

//
const deleteImages = asyncHandler(async( req, res) =>{
    const {id} = req.params;
    try {
    const deleted = cloudinaryDeleteImg(id, "images");
       res.json({message: "Deleted"});

    } catch (error) {
        throw new Error(error)
    }
});

module.exports ={
    uploadImages,
    deleteImages,
}