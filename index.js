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
        const ordersCollection = database.collection('orders');

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
        //Get All orders for Admin
        app.get('/manageorder', async(req,res) => {
            const data = ordersCollection.find();
            const orders = await data.toArray();
            res.send(orders);
        })
        //Get specific user Orders
        app.get('/orders/:usid', async(req,res) => {
            const id = req.params.usid;
            const query = {userId: id}
            const data = ordersCollection.find(query);
            const orders = await data.toArray();
            res.send(orders);
        })
        

        //Post api
        app.post('/users', async(req, res) => {
            const newUser = req.body;
            const {email} = newUser;
            const existingUser = await usersCollection.findOne({email});
            if(existingUser){
                console.log("already user exist")
                res.json({error: "User already exist"})
            } else {
                const result = await usersCollection.insertOne(newUser);
                res.json(result);
            }
            
          })

        //Get orders
        app.post('/orders', async(req, res) => {
            const orderPackage = req.body;
            const result = await ordersCollection.insertOne(orderPackage);
            res.json(result);
          })

        //Add a new offer Package
        app.post('/packages', async(req, res) => {
            const newOfferPackage = req.body;
            const result = await packageCollection.insertOne(newOfferPackage);
            res.json(result);
          })



        //Delete api
        app.delete('/orders/:usid', async(req,res) => {
            const id = req.params.usid;
            const query = {selectedPackageId: id}
            const result = ordersCollection.deleteOne(query);
            res.send(result);
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