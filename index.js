const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1gqcx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        //console.log('connnected to databse');
        const database = client.db('tour-a-dour');
        const servicesCollection = database.collection('services');
        const ordersCollection = database.collection('order');

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // GET Single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);
            console.log(service);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });

        // DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })

        //Delete API
        app.delete('/order/:email', async (req, res) => {
            const id = req.params.id;
            console.log('deleting user id', id);
            const query = { _id: ObjectId(id) };
            const result = await collectionUsers.deleteOne(query);
            console.log('deleting user with id', result);
            res.json(result);
        })
        //get api user

        app.get('/order', async (req, res) => {
            const cursor = ordersCollection.find({});
            const order = await cursor.toArray();
            res.send(order);
        });

        //Post  Api User;
        app.post('/order', async (req, res) => {
            const order = req.body;
            console.log(order);
            const confirm = await ordersCollection.insertOne(order);
            console.log(result);
            res.json(result);
        });
        // GET all user
        app.get('/order', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });
        //get my user
        app.get('/order/:email', async (req, res) => {
            const cursor = ordersCollection.find({ email: req.params.email });
            const order = await cursor.toArray();
            console.log(order);
            res.send(order);
        });

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Tour-a-dour Server');
});


app.listen(port, () => {
    console.log('Running Genius Server on port', port);
})