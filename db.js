import { MongoClient } from "mongodb";
import 'dotenv/config';

export const connectDB = async (callback) => {
    try {
        const client = new MongoClient(`${process.env.MONGODB_ATLAS_URI}`);
        await client.connect();
        console.log('Connected to MongoDB');

        return callback(null, client.db("library"));
    }
    catch(error) {
        console.log(error);
        return callback(error, null);
    }
}