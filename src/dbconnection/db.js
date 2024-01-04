import { connect } from mongoose;
require('dotenv').config();


const mongoDb = process.env.MONGO_URI;



async function dbConnection() {
    try {
        await connect(mongoDb);
    } catch (error) {
        console.log(error);
    }
}


export { dbConnection };


