const express = require('express');
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//mongodb connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vbfyw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run () {
    try {
        await client.connect();
        const database= client.db('travel-packages');
        const packageCollection = database.collection('packages');
        const usersCollection = database.collection('users');

        //Get Api
        app.get('/packages', async(req,res) => {
            const data = packageCollection.find({});
            const packages = await data.toArray();
            res.send(packages)
        })

        //Get Single Packages
        app.get('/packages/:id', async(req,res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const singlePackage = await packageCollection.findOne(query);
            res.send(singlePackage);
        })

        //Get New user
        app.post('/users', async(req, res) => {
            const newUser = req.body;
            console.log(newUser);
            const result = await usersCollection.insertOne(newUser);
            console.log('got new user', req.body);
            console.log('added user', result);
            res.json(result);
          })
    }
    finally {
    //    await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Server is running');
})

app.listen(port, () => {
    console.log('app is listening the port', port);
})