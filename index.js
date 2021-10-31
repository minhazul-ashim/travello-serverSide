const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ptzya.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//Middlewares

app.use(cors());
app.use(express.json());

//Database functionalities

async function run() {

    try {

        await client.connect();

        const database = client.db('travello')
        const destinationCollection = database.collection('destinations');
        const bookingCollection = database.collection('bookings')
        const teamCollection = database.collection('team')

        //GET API for retrieving all the destinations
        app.get('/destinations', async (req, res) => {

            const cursor = destinationCollection.find({});
            const result = await cursor.toArray();

            res.send(result);
        })

        //GET API for retrieving the detail with id;
        app.get('/location/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const result = await destinationCollection.findOne(query);

            res.send(result);
        })

        //GET API for retrieving orders of a user;
        app.get('/bookings/user', async (req, res) => {

            const queryEmail = req.query.search;
            const cursor = bookingCollection.find({ userEmail: queryEmail });

            const result = await cursor.toArray()

            res.send(result);
        })

        //GET API for retrieving all the orders for the admin;

        app.get('/bookings', async (req, res) => {

            const cursor = bookingCollection.find({});
            const result = await cursor.toArray();
            res.send(result)
        })

        //GET API for retrieving team members;
        app.get('/team', async (req, res) => {

            const cursor = teamCollection.find({});
            const result = await cursor.toArray();

            res.send(result)
        })

        //POST API for inserting data into the orders collection;

        app.post('/bookings', async (req, res) => {

            const data = req.body;
            const result = await bookingCollection.insertOne(data);

            res.json(result);
        })

        //POST API for inserting a new service for the admin;
        app.post('/destinations', async (req, res) => {

            const data = req.body;
            const result = await destinationCollection.insertOne(data);

            res.json(result)
        })

        //DELETE API for cancelling user booking;
        app.delete('/booking', async (req, res) => {

            const user = req.query.email;
            const bookingId = req.query.id;

            const cursor = bookingCollection.deleteOne({ userEmail: user, packId: bookingId });

            res.json(cursor);
        })

        //Delete API for admin deletion;
        app.delete('/admin/delete/:id', async (req, res) => {

            const id = req.params.id;

            const cursor = bookingCollection.deleteOne({ packId: id });

            res.json(cursor)
        })

        //DELETE API for the admin to delete a package;
        app.delete('/destinations/:id', async (req, res) => {

            const id = req.params.id;

            const cursor = destinationCollection.deleteOne({ _id: ObjectId(id) });

            res.json(cursor)
        })

        //UPDATE API for approving the clients vacation;
        app.put('/modify/:id', async (req, res) => {
            const id = req.params.id;

            const filter = { packId: id }
            const updateDoc = {
                $set: {
                    status: 'Approved'
                }
            }
            const result = await bookingCollection.updateOne(filter, updateDoc)
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



