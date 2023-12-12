const {cloudinaryUploadImg, cloudinaryDeleteImg} = require('../utils/cloudinary');
const fs = require('fs');
const asyncHandler = require('express-async-handler');
// 
// const uploadImages = asyncHandler(async( req, res) =>{
//     try {
//         const uploader = (path) => cloudinaryUploadImg(path, "images");
//         const urls = [];
//         const files = req.files;
//         for(const file of files){
//             const {path} = file;
//             const newpath = await uploader(path);
//             console.log(newpath);
//             urls.push(newpath);
//             fs.unlinkSync(path);
//         }
//         const images = urls.map((file) =>{
//             return file;
//         });
//         res.json(images);
//     } catch (error) {
//         throw new Error(error)
//     }
// });


const uploadImages = asyncHandler(async (req, res) => {
    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newpath = await uploader(path);
            console.log(newpath);
            urls.push(newpath);

            // Kiểm tra xem tệp tin có tồn tại trước khi xóa
            if (fs.existsSync(path)) {
                fs.unlinkSync(path);
            } else {
                console.log(`File ${path} không tồn tại`);
            }
        }
        const images = urls.map((file) => {
            return file;
        });
        res.json(images);
    } catch (error) {
        throw new Error(error);
    }
});


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