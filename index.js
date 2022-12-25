const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000
// clothsProducts products

// clothsStore POKPCxdGyVzOipiY


app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vfwpldl.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const allProductsCollection = client.db('clothsProducts').collection('products')
        const ratingCollection =  client.db('clothsProducts').collection('ratings')
        const contactCollection =  client.db('clothsProducts').collection('contact')

        app.get('/products', async(req, res) =>{
            const query = {}
            const result = await allProductsCollection.find(query).limit(6).toArray()
            res.send(result)
        })
        app.get('/allProducts', async(req, res) =>{
            const query = {}
            const result = await allProductsCollection.find(query).toArray()
            res.send(result)
        })
        app.get('/ratings', async(req, res) =>{
            const query = {}
            const result = await ratingCollection.find(query).limit(6).toArray()
            res.send(result)
        })
        app.post('/ratings', async(req, res) =>{
            const rating = req.body
            const result = await ratingCollection.insertOne(rating)
            res.send(result)
        })
        app.post('/contact', async(req, res) =>{
            const rating = req.body
            const result = await contactCollection.insertOne(rating)
            res.send(result)
        })
        

    }
    finally{

    }

}
run().catch(console.log())



app.get('/',( req, res) => {
    res.send('api is running')
})
app.listen(port, () =>{
    console.log('api is running on ', port);
})