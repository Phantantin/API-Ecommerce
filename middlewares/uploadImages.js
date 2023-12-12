const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const os = require('os');

const multerStorage = multer.diskStorage({
    destination: function(req,file, cb){
        cb(null, path.join(__dirname, "../public/images/"));
    },
    filename: function(req,file, cb){
        const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname+ "-" + uniquesuffix + ".JPEG");
    },
});

const multerFilter = (req, file, cb)=>{
    if(file.mimetype.startsWith("image")){
        cb(null, true);
    }else{
        cb({
            message: "Unsupported file format",
        }, false)
    }
}

const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: {fieldSize: 2000000},
});

const tempDir = os.tmpdir(); // Tạo thư mục tạm thời

// const productImgResize = async(req, res, next) =>{
//     if(!req.files) return next();
//     await Promise.all(
//         req.files.map(async(file) =>{
//             await sharp(file.path)
//                 .resize(300, 300)
//                 .toFormat("jpeg")
//                 .jpeg({quality: 90})
//                 .toFile(`public/images/products/${file.filename}`);
//             // fs.unlinkSync(`public/images/products/${file.filename}`);
//         })
        
//     );
//     next();
// };

const productImgResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(
        req.files.map(async (file) => {
            const tempFilePath = path.join(tempDir, file.filename); // Lưu ảnh tạm thời vào thư mục tạm
            await sharp(file.path)
                .resize(300, 300)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(tempFilePath);

            const uploadResult = await cloudinaryUploadImg(tempFilePath, 'images'); // Upload ảnh từ thư mục tạm lên Cloudinary

            fs.unlinkSync(tempFilePath); // Xóa ảnh tạm thời sau khi upload lên Cloudinary
        })
    );
    next();
};

const blogImgResize = async(req, res, next) =>{
    if(!req.files) return next();
    await Promise.all(
        req.files.map(async(file) =>{
            await sharp(file.path)
                .resize(300, 300)
                .toFormat("jpeg")
                .jpeg({quality: 90})
                .toFile(`public/images/blogs/${file.filename}`);
            // fs.unlinkSync(`public/images/blogs/${file.filename}`);
        })
    );
    next();
};



module.exports = {uploadPhoto, productImgResize, blogImgResize};