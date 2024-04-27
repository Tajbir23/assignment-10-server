require('dotenv').config()
const express = require('express');

const port = process.env.PORT || 5000
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
app.use(cors());

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.g1xrt1f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    //   await client.connect();
      // Send a ping to confirm a successful connection
    //   await client.db("admin").command({ ping: 1 });

    const database = await client.db("art_craft")
    const sub_categories = await database.collection('subcategory_name');
    const craft = await database.collection('craft');

      app.get('/sub_categories', async(req, res) =>{
        const result = await sub_categories.find().toArray();
        res.send(result);
      })

      app.post('/add_craft', async(req, res) => {
        console.log(req.body)
        const result = await craft.insertOne(req.body);
        console.log(result);
        res.json(result);
      })

      app.get('/category/:category', async (req, res) => {
        console.log(req.params.category)
        const result = await craft.find({subcategory_name: req.params.category}).toArray();
        console.log(result);
        res.send(result);
      })

      app.get('/six_data', async (req, res) => {
        const result = await craft.find().limit(6).toArray();
        console.log(result);
        res.send(result);
      })

      app.get('/view_details/:id', async (req, res) => {
        const result = await craft.findOne({_id: new ObjectId(req.params.id)});
        console.log(result);
        res.send(result);
      })

      app.get('/all_art_crafts', async (req, res) => {
        const result = await craft.find().toArray();
        console.log(result);
        res.send(result);
      })

      app.get('/my_art_crafts/:id', async (req, res) => {
        const result = await craft.find({user_email: req.params.id}).toArray();
        console.log(result);
        res.send(result);
      })

      app.get('/customization/:id/:email', async (req, res) => {
        const result = await craft.find({customization: req.params.id, user_email: req.params.email}).toArray();
        console.log(result);
        res.send(result);
      })

      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.error);


app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});