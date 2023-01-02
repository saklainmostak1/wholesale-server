const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken')
require('dotenv').config()
const app = express()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const port = process.env.PORT || 5000
// clothsProducts products

// clothsStore POKPCxdGyVzOipiY


app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vfwpldl.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function verifyJWT(req, res, next) {
    console.log('token', req.headers.authorization);
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).send('unauthorize access')
    }
    const token = authHeader.split(' ')[1]

    jwt.verify(token, process.env.ACCESS_TOKEN, function (error, decoded) {
        if (error) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded
        next()
    })
}

async function run() {
    try {
        const allProductsCollection = client.db('clothsProducts').collection('products')
        const ratingCollection = client.db('clothsProducts').collection('ratings')
        const contactCollection = client.db('clothsProducts').collection('contact')
        const usersCollection = client.db('clothsProducts').collection('users')
        const ordersCollection = client.db('clothsProducts').collection('orders')
        const repotedProductCollection = client.db('clothsProducts').collection('report')
        const productReviewCollection = client.db('clothsProducts').collection('productsReviews')
        const paymentsCollection = client.db('clothsProducts').collection('payments')

        // app.get('/products', async(req, res) =>{
        //     const query = {}
        //     const result = await allProductsCollection.find(query).limit(6).toArray()
        //     res.send(result)
        // })
        app.get('/allProducts', async (req, res) => {
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
        app.get('/allProducts/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const result = await allProductsCollection.findOne(filter)
            res.send(result)
        })
        app.get('/ratings', async (req, res) => {
            const query = {}
            const result = await ratingCollection.find(query).limit(6).toArray()
            res.send(result)
        })
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const result = await usersCollection.findOne(filter)
            res.send(result)
        })
        app.get('/productsRatings/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const result = await productReviewCollection.findOne(filter)
            res.send(result)
        })
        app.get('/allOrder', async (req, res) => {
            const query = {}
            const result = await ordersCollection.find(query).limit(6).toArray()
            res.send(result)
        })
        app.get('/contact', async (req, res) => {
            const query = {}
            const result = await contactCollection.find(query).limit(6).toArray()
            res.send(result)
        })
        app.get('/productsRatings', async (req, res) => {
            const query = {}
            const result = await productReviewCollection.find(query).toArray()
            res.send(result)
        })
        app.get('/users', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email,
                }
            }
            const cursor = usersCollection.find(query)
            const review = await cursor.toArray()
            res.send(review)
        })
        // app.get('/users', async(req, res) =>{
        //     const query = {}
        //     const result = await usersCollection.find(query).toArray()
        //     res.send(result)
        // })

        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email
            const query = { email }
            const user = await usersCollection.findOne(query)
            res.send({ isAdmin: user?.role === 'admin' })
        })

        app.get('/users/buyer/:email', async (req, res) => {
            const email = req.params.email
            // const id = req.params.id
            const query = { email }
            const user = await usersCollection.findOne(query)
            res.send({ isBuyers: user?.role === 'buyers' })
        })


        app.get('/orders', verifyJWT, async (req, res) => {
            const email = req.query.email
            const decodedEmail = req.decoded.email;
            if (email !== decodedEmail) {
                return res.status(403).send({ message: 'forbidden access' })
            }
            // console.log('token',req.headers.authorization);
            const query = { email: email }
            const result = await ordersCollection.find(query).toArray()
            res.send(result)
        })


        app.get('/jwt', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const user = await usersCollection.findOne(query)
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '1h' })
                return res.send({ accessToken: token })
            }
            console.log(user);
            res.status(403).send({ accessToken: '' })
        })


        app.get('/report', async (req, res) => {
            const query = {}
            const result = await repotedProductCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/allReviews', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email,
                }
            }
            const cursor = productReviewCollection.find(query)
            const review = await cursor.toArray()
            res.send(review)
        })

        // app.get('/productsReviews', async(req, res) =>{
        //     const query = {}
        //     const result = await productReviewCollection.find(query).toArray()
        //     res.send(result)
        // })
        app.get('/productReviews', async (req, res) => {
            console.log(req.query);
            let query = {}
            if (req.query.products) {
                query = {
                    products: req.query.products
                }
            }
            const cursor = productReviewCollection.find(query)
            const review = await cursor.toArray()
            res.send(review)
        })
        // payments start
        app.get('/allOrder/:id', async(req, res) => {
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const result = await ordersCollection.findOne(query)
            res.send(result)
        })

        app.post('/create-payment-intent', async(req, res)=>{
            const orders = req.body
            const price = orders.price
            const amount = price * 100

            const paymentIntent = await stripe.paymentIntents.create({
                currency: 'usd',
                amount: amount,
                "payment_method_types": [
                    "card"
                  ],

            })
            res.send({
                clientSecret: paymentIntent.client_secret,
              });
        })

        app.post('/payments', async(req, res) =>{
            const payment = req.body
            const result = await paymentsCollection.insertOne(payment)
            const id = payment.OrderId
            const query = {_id: ObjectId(id) }
            const updatedDoc = {
                $set: {
                    paid: true,
                    transactionId: payment.transactionId 
                }
            }
            const updated = await ordersCollection.updateOne(query, updatedDoc)
            res.send(result)
        })


        // payments end
        app.post('/ratings', async (req, res) => {
            const rating = req.body
            const result = await ratingCollection.insertOne(rating)
            res.send(result)
        })
        app.post('/contact', async (req, res) => {
            const rating = req.body
            const result = await contactCollection.insertOne(rating)
            res.send(result)
        })
        app.post('/users', async (req, res) => {
            const users = req.body
            const result = await usersCollection.insertOne(users)
            res.send(result)
        })
        app.post('/orders', async (req, res) => {
            const order = req.body

            const result = await ordersCollection.insertOne(order)
            res.send(result)
        })
        app.post('/report', async (req, res) => {
            const reports = req.body
            const result = await repotedProductCollection.insertOne(reports)
            res.send(result)
        })
        app.post('/productsReviews', async (req, res) => {
            const reports = req.body
            const result = await productReviewCollection.insertOne(reports)
            res.send(result)
        })
        app.post('/addProducts', async (req, res) => {
            const reports = req.body
            const result = await allProductsCollection.insertOne(reports)
            res.send(result)
        })

        app.put('/users/admin/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.deleteOne(query)
            res.send(result)
        })
        app.delete('/allProducts/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await allProductsCollection.deleteOne(query)
            res.send(result)
        })
        app.delete('/allReviews/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await productReviewCollection.deleteOne(query)
            res.send(result)
        })
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await usersCollection.deleteOne(query)
            res.send(result)
        })
        app.delete('/ratings/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await ratingCollection.deleteOne(query)
            res.send(result)
        })

        app.delete('/report/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await repotedProductCollection.deleteOne(query)
            res.send(result)
        })
        app.delete('/productsRatings/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await productReviewCollection.deleteOne(query)
            res.send(result)
        })
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const user = req.body
            const options = {upsert: true}
            const updatedUser = {
                $set: {
                    name: user.name,
                    // adress: user.adress,
                    email: user.email,
                    photo: user.photo
                    
                }
            }
            const result = await usersCollection.updateOne(filter, updatedUser, options)
            res.send(result)
            console.log(user)
        })
        app.put('/allProducts/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const products = req.body
            console.log(products);
            const options = {upsert: true}
            const updatedProducts = {
                $set: {
                    name: products.name,
                    price: products.price,
                    image: products.image
                    
                }
            }
            const result = await allProductsCollection.updateOne(filter, updatedProducts, options)
            res.send(result)
           
        })
        app.put('/productsRatings/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const review = req.body
            console.log(review)
            const option = { upsert: true }
            const updateReview = {
                $set: {
                    rating: review.rating,
                    text: review.text
                }
            }
            const result = await productReviewCollection.updateOne(filter, updateReview, option)
            res.send(result)
           
        })



    }
    finally {

    }

}
run().catch(console.log())



app.get('/', (req, res) => {
    res.send('api is running')
})
app.listen(port, () => {
    console.log('api is running on ', port);
})