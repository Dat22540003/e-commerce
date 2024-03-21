const {default: mongoose} = require('mongoose');
mongoose.set('strictQuery', false);

const dbconnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        if(conn.connection.readyState === 1){
            console.log('DB connection successful!')
        } else {
            console.log('DB connection failed!')
        }
    } catch (error) {
        console.log('DB connection failed!');
        throw new Error(error);
    }
};

module.exports = dbconnect;