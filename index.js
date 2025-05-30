const express = require('express');
const cors=require('cors')
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lhnyl9u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const coffeeCollections = client.db('coffeeDB').collection('coffees');
        const usersCollections=client.db('coffeeDB').collection('users')


        app.get('/coffees',async(req, res)=> {
            const result = await coffeeCollections.find().toArray();
            res.send(result);
        })

        app.get('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollections.findOne(query);
            res.send(result);
        })



        app.post('/coffees', async(req, res) => {
            const newCoffee = req.body;
            
            console.log(newCoffee)
            const result = await coffeeCollections.insertOne(newCoffee);
            res.send(result)
        })

        app.put('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateCoffee = req.body;
            const updateDoc = {
                $set:updateCoffee
            }
            const result = await coffeeCollections.updateOne(filter, updateDoc);
            res.send(result);
        })

        app.delete('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollections.deleteOne(query);
            res.send(result);

            
        })

        // user APIs

        app.post('/users', async (req, res) => {
            const userProfile = req.body;
            const result = await usersCollections.insertOne(userProfile);
            res.send(result);
        })






        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Coffee server is getting hotter!!')
});

app.listen(port, () => {
    console.log(`Coffee server is running on port ${port}`)
})