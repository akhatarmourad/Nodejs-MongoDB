import { MongoClient } from "mongodb";

let clientDB;

const connectDB = async (callback) => {
    try {
        await MongoClient.connect(`${process.env.MONGODB_URI}`, (error, db) => {
            if(error) {
                console.log(`Error in connection : ${error}`);
                return callback(error);
            }
            else {
                console.log(`Connected to MongoDB`);
                return db;
            }
        })
    }
    catch(error) {
        console.log(error);
        return callback(error);
    }
}

const getDB = () => connectDB;


module.export = {
    connectDB,
    getDB
}