const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000
// clothsProducts products

app.use(cors())
app.use(express.json())

app.get('/',( req, res) => {
    res.send('api is running')
})
app.listen(port, () =>{
    console.log('api is running on ', port);
})