const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const usersCollection =  client.db('clothsProducts').collection('users')
        const ordersCollection =  client.db('clothsProducts').collection('orders')
        const repotedProductCollection =  client.db('clothsProducts').collection('report')

        // app.get('/products', async(req, res) =>{
        //     const query = {}
        //     const result = await allProductsCollection.find(query).limit(6).toArray()
        //     res.send(result)
        // })
        app.get('/allProducts', async(req, res) =>{
            const query = {}
            const result = await allProductsCollection.find(query).toArray()
            // const quantityQuery = {}
            // const alreadyOrderd = await ordersCollection.find(quantityQuery).toArray()
            // result.forEach(resul => {
            //     const optionOrderd = alreadyOrderd.filter(order => order.name === resul.name)
            //     console.log(optionOrderd)
            // } )
            res.send(result)
        })
        app.get('/allProducts/:id', async(req, res) =>{
            const id = req.params.id
            const filter = {_id: ObjectId(id)}
            const result = await allProductsCollection.findOne(filter)
            res.send(result)
        })
        app.get('/ratings', async(req, res) =>{
            const query = {}
            const result = await ratingCollection.find(query).limit(6).toArray()
            res.send(result)
        })
        app.get('/contact', async(req, res) =>{
            const query = {}
            const result = await contactCollection.find(query).limit(6).toArray()
            res.send(result)
        })
        app.get('/users', async(req, res) =>{
            const query = {}
            const result = await usersCollection.find(query).toArray()
            res.send(result)
        })
        app.get('/orders', async(req, res) =>{
            const email = req.query.email
            const query = {email: email}
            const result = await ordersCollection.find(query).toArray()
            res.send(result)
        })
        app.get('/report', async(req, res) =>{
            const query = {}
            const result = await repotedProductCollection.find(query).toArray()
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
        app.post('/users', async(req, res) =>{
            const users = req.body
            const result = await usersCollection.insertOne(users)
            res.send(result)
        })
        app.post('/orders', async(req, res) =>{
            const order = req.body

            const result = await ordersCollection.insertOne(order)
            res.send(result)
        })
        app.post('/report', async(req, res) =>{
            const reports = req.body
            const result = await repotedProductCollection.insertOne(reports)
            res.send(result)
        })
        app.put('/users/admin/:id', async(req, res) =>{
            const id = req.params.id
            const filter = {_id: ObjectId(id)}
            const options = {upsert: true}
            const updatedDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options)
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