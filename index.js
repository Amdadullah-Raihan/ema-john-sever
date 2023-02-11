const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port = 5000
const app = express();
const cors = require('cors');

app.use(cors())

app.get('/', (req, res) => {

    res.send("Responding to ema-jhon-server")
})
app.listen(port, (req, res) => {
    console.log('Lestening to port, ', port)
})


//connecting mongodb

const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xplq2xb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        console.log("Database Connected")
        await client.connect();
        const database = client.db('emaJohn');
        const productsCollection = database.collection('products')

        //GET products API
        app.get('/products', async(req, res)=>{
            const cursor = productsCollection.find({})
            const count = await cursor.count();
        
            console.log(req.query);
            const page = req.query.page;
            const size = req.query.size;
            let products;
            if(page){
                 products = await cursor.skip(page*size).limit(parseInt(size)).toArray();
            }
            else{
                products = await cursor.toArray()
            }

            
        res.send(
            {
             count,
             products
            }
             )
        })

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);