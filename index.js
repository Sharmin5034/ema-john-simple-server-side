const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
var cors = require('cors')
require('dotenv').config()
const app = express()
const port = 5000
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS }@cluster0.xxtemhw.mongodb.net/?retryWrites=true&w=majority`;

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
    const productCollection = client.db('emaJohnDB').collection('products')
    
    // Send a ping to confirm a successful connection
    
        app.get('/', (req, res) => {
            res.send('Hello devoloper!')
          })
        app.get('/products', async(req, res) => {
            console.log(req.query)
            const page = parseInt(req.query.page) || 0;
            const limit = parseInt(req.query.limit) || 10;            
            const skip = page  * limit;
            const result = await productCollection.find().skip(skip).limit(limit).toArray()
            res.send(result)
          })

          app.post('/productsByIds', async (req, res) => {
            const ids = req.body;
            const objectIds = ids.map((id) => new ObjectId(id));
            const query ={_id: {$in: objectIds}}
            const result =await productCollection.find(query).toArray()
            res.send(result)
          })

          app.get('/totalproducts', async(req,res)=>{
            const result =await productCollection.estimatedDocumentCount();
            res.send({totalproducts: result})
          })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);




app.listen(port, () => {
  console.log(`ema john server is running on port: ${port}`)
})