import express from "express";
import { connectDB, getDB } from "./db";

// * Config
const app = express();
const PORT = process.env.PORT || 6500;
let clientDB;

// * Connect to DB
const db = connectDB((error) => {
    if(error) {
        console.log(error);
    } 
    else {
        clientDB = getDB();

        // * Launch Server
        app.listen(PORT, () => {
            console.log(`Server running on port : ${PORT}`);
        });
    }
});

// * Routes
app.get('/books',async (request, response) => {
    console.log(request.query);
    data = [];

    const cursor = await clientDB.collection('books').find().sort({ author: 1});
    cursor.forEach((book) => {
        data.push(book);
    });

    return response.status(200).send({books: data})
});
 