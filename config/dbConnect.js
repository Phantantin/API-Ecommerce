// const {default: mongoose} = require('mongoose')

// const dbConnect= ()=>{
//     try{
//         const conn = mongoose.connect(process.env.MONGODB_URL);
//         console.log("Database Connect Successfully");
//     }catch(error){
//         console.log("Database error");
//     }
// }

// module.exports = dbConnect;

const mongoose = require('mongoose');

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // Chỉ định write concern trong cấu hình kết nối
            // 'majority' đảm bảo việc ghi sẽ được đảm bảo trên phần lớn các node trong replica set
            // Tuy nhiên, write concern thường được chỉ định trong từng hoạt động ghi cụ thể hơn
            // Bạn cần đặt write concern tương ứng khi thực hiện mỗi hoạt động ghi.
            // Ví dụ: await SomeModel.create({ someField: 'someValue' }, { writeConcern: { w: 'majority' } });
            // Lưu ý rằng writeConcern chỉ là một trong các tùy chọn, bạn có thể cần thêm các tùy chọn khác tùy thuộc vào yêu cầu cụ thể của bạn.
        });
        console.log("Database Connected Successfully");
    } catch (error) {
        console.error("Database Connection Error:", error);
    }
};

module.exports = dbConnect;
