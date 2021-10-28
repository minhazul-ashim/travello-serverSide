const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ptzya.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


console.log(uri)
//Middlewares

app.use(cors());
app.use(express.json());

//Database functionalities

async function run() {

    try {

        await client.connect();

        const database = client.db('travello')
        const destinationCollection = database.collection('destinations');

        //GET API for retrieving all the destinations
        app.get('/destinations', async (req, res) => {

            const cursor = destinationCollection.find({});
            const result = await cursor.toArray();

            res.send(result);
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {

    res.send('The server is live')
})

app.listen(port, () => {

    console.log('The server is listening at port ', port)
})



