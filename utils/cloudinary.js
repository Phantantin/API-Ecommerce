// const cloudinary = require('cloudinary').v2;

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.SECRET_KEY,
// });

// const cloudinaryUploadImg = async (fileToUploads) => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload(fileToUploads, (error, result) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve({
//           url: result.secure_url,
//         },{
//             resource_type: "auto",
//         });
//       }
//     });
//   });
// };

// module.exports = cloudinaryUploadImg;




const cloudinary = require('cloudinary');


cloudinary.v2.config({
  cloud_name: 'dfc9wz4r8',
  api_key: '232953888427314',
  api_secret: 'wdSsqQbN9SelzpuaZhmdc5AHAc8',
  secure: true,
});

const cloudinaryUploadImg = async (fileToUploads) => {
    return new Promise((resolve) => {
      cloudinary.uploader.upload(fileToUploads, (result) => {
        resolve(
          {
            url: result.secure_url,
            asset_id: result.asset_id,
            public_id: result.public_id,
          },
          {
            resource_type: "auto",
          }
        );
      });
    });
};

const cloudinaryDeleteImg = async (fileToDelete) => {
  return new Promise((resolve) => {
    cloudinary.uploader.destroy(fileToDelete, (result) => {
      resolve(
        {
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
        },
        {
          resource_type: "auto",
        }
      );
    });
  });
};

module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };
