const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000
// clothsProducts products

// clothsStore POKPCxdGyVzOipiY




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vfwpldl.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const allProductsCollection = client.db('clothsProducts').collection('products')

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

    }
    finally{

    }

}
run().catch(console.log())


app.use(cors())
app.use(express.json())

app.get('/',( req, res) => {
    res.send('api is running')
})
app.listen(port, () =>{
    console.log('api is running on ', port);
})