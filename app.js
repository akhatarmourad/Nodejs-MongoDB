import express from "express";
import 'dotenv/config';
import { connectDB } from "./db.js";
import { ObjectId } from "mongodb";

// * Config
const app = express();
const PORT = process.env.PORT || 6500;
let clientDB;

// * Middleware
app.use(express.json());

// * Connect to DB
connectDB(async (error, db) => {
    if(error) {
        console.log(error);
        return;
    }

    clientDB = db;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

// * Routes
app.get('/books',async (request, response) => {

    console.log(request.query);
    let data = [];
    const page = request.query.page || 0;
    const resultsPerPage = 2;

    try {
        await clientDB.collection('books')
            .find()
            .sort({ author: 1})
            .skip(page * resultsPerPage)
            .limit(resultsPerPage)
            .forEach((book) => {
                data.push(book);
            });

        return response.status(200).send({books: data});
    }
    catch(error) {
        return response.status(400).send({error: error.message});
    }
});


// * Get a single book
app.get('/books/:id', async (request, response) => {
    const { id } = request.params;
    
    try {
        const data = await clientDB.collection('books').findOne({ _id: new ObjectId(id)});
        
        return response.status(200).send({book: data});
    }
    catch(error) {
        console.log(error);
        return response.status(400).send({error: error.message});
    }
});

// * POST : create a new book
app.post('/books', async (request, response) => {
    const body = request.body;

    try {
        await clientDB.collection('books').insertOne(body);

        return response.status(201).send({message: 'Book created successfully'});
    }
    catch(error) {
        console.log(error);
        return response.staus(400).sedn({error: error.message});
    }
});

// * DELETE : delete a book
app.delete('/books/:id', async (request, response) => {
    const { id } = request.params;

    try {
        await clientDB.collection('books').deleteOne({_id: new ObjectId(id)});

        return response.status(200).send({message: 'Book deleted successfully'});
    }
    catch(error) {
        console.log(error);
        return response.status(400).send({error: error.message});
    }
})

// * PATCH : update part of a book
app.patch('/books/:id', async (request, response) => {
    const { id } = request.params;
    const data = request.body;

    try {
        await clientDB.collection('books').updateOne({_id: new ObjectId(id)}, {$set: data});
        return response.status(200).send({message: 'Book updated successfully'});
    }
    catch(error) {
        console.log(error);
        return response.status(400).send({message: 'Book not found'});
    }
});