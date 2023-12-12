const { cloudinaryUploadImg } = require('../utils/cloudinary');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const os = require('os');


const tempDir = os.tmpdir(); // Đường dẫn thư mục tạm thời
// const uploadDir = path.join(__dirname, "../public/images/"); // Đường dẫn thư mục upload

// const uploadDir = 'D:/Ecommerce-Deploy/backend/public/images/';

// // Kiểm tra và tạo thư mục nếu chưa tồn tại
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

const multerStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, tempDir); // Lưu ảnh tạm vào thư mục tạm
    },
    filename: function(req, file, cb) {
        const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniquesuffix + ".JPEG");
    },
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb({ message: "Unsupported file format" }, false);
    }
};

const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fieldSize: 2000000 },
});


// const productImgResize = async (req, res, next) => {
//     if (!req.files) return next();

//     await Promise.all(
//         req.files.map(async (file) => {
//             try {
//                 const result = await cloudinaryUploadImg(file.path);
//                 console.log('Uploaded to Cloudinary:', result);
                
//                 // Tiếp theo, bạn có thể làm gì đó với URL đã upload lên Cloudinary

//             } catch (error) {
//                 console.error('Error uploading to Cloudinary:', error);
//             }
//         })
//     );
//     next();
// };

const productImgResize = async (req, res, next) => {
    if (!req.files) return next();

    await Promise.all(
        req.files.map(async (file) => {
            try {
                // Resize ảnh trước khi upload lên Cloudinary
                const resizedImage = await sharp(file.path)
                    .resize(300, 300)
                    .toFormat("jpeg")
                    .jpeg({ quality: 90 })
                    .toBuffer();

                // Upload ảnh đã resize lên Cloudinary
                const result = await cloudinaryUploadImg(resizedImage);
                console.log('Uploaded to Cloudinary:', result);

                // Tiếp theo, bạn có thể làm gì đó với URL đã upload lên Cloudinary

            } catch (error) {
                console.error('Error uploading to Cloudinary:', error);
            }
        })
    );
    next();
};


const blogImgResize = async (req, res, next) => {
    if (!req.files) return next();

    await Promise.all(
        req.files.map(async (file) => {
            try {
                // Resize ảnh
                const resizedImage = await sharp(file.path)
                    .resize(300, 300)
                    .toFormat("jpeg")
                    .jpeg({ quality: 90 })
                    .toBuffer();

                // Upload ảnh đã resize lên Cloudinary
                const cloudinaryResult = await cloudinaryUploadImg(resizedImage);

                console.log('Uploaded to Cloudinary:', cloudinaryResult);
                // Tiếp theo, bạn có thể làm gì đó với URL đã upload lên Cloudinary
            } catch (error) {
                console.error('Error uploading to Cloudinary:', error);
            }
        })
    );
    next();
};


// const productImgResize = async (req, res, next) => {
//     if (!req.files) return next();
    
//     await Promise.all(
//         req.files.map(async (file) => {
//             const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); // Khai báo uniqueSuffix ở đây
//             const tempFilePath = path.join(uploadDir, file.fieldname + '-' + uniqueSuffix + '.JPEG');
//             const resizedFilePath = path.join(uploadDir, 'resized-' + file.fieldname + '-' + uniqueSuffix + '.JPEG');

//             await sharp(file.path)
//                 .resize(300, 300)
//                 .toFormat('jpeg')
//                 .jpeg({ quality: 90 })
//                 .toFile(resizedFilePath);

//             console.log('resizedFilePath file path:', resizedFilePath);
//             console.log('Temporary file path:', tempFilePath);
//         })
//     );
//     next();
// };


// const blogImgResize = async(req, res, next) => {
//     if (!req.files) return next();
//     await Promise.all(
//         req.files.map(async (file) => {
//             await sharp(file.path)
//                 .resize(300, 300)
//                 .toFormat("jpeg")
//                 .jpeg({ quality: 90 })
//                 .toFile(path.join(uploadDir, `blogs/${file.filename}`)); // Lưu ảnh vào thư mục tương ứng
//         })
//     );
//     next();
// };

module.exports = { uploadPhoto, productImgResize, blogImgResize };
