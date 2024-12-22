require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

// mongo url
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sdg7y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// creating mongo client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("LearnMate server is running successfully!");
});

async function run() {
  try {
    client.connect();
    console.log("mongodb connected successfully");
    const db = client.db("learnMate");
    const usersCollection = db.collection("users");
    const tutorsCollection = db.collection("tutors");
    // save per user to db
    app.post("/user", async (req, res) => {
      const user = req.body;
      const exists = await usersCollection.findOne({ email: user.email });
      if (exists) return;
      await usersCollection.insertOne(req.body);
    });
    // get all tutors
    app.get("/tutors", async (req, res) => {
      const category = req.query.category;
      let query = {};
      if (category) {
        query.category = category;
      } else {
        query = {};
      }
      const result = await tutorsCollection.find(query).toArray();
      console.log(result, query);
      res.send(result);
    });
    // get all categories
    app.get("/tutors/categories", async (req, res) => {
      const result = await tutorsCollection
        .find({}, { projection: { _id: 0, category: 1 } })
        .toArray();
      res.send(result);
    });
    // get signle tutorial
    app.get("/tutors/:id", async (req, res) => {
      const id = new ObjectId(req.params.id);
      const result = await tutorsCollection.findOne({ _id: id });
      res.send(result);
    });
    // save per tutorial on db
    app.post("/tutors", async (req, res) => {
      const tutor = req.body;
      const result = await tutorsCollection.insertOne(tutor);
      res.send(result);
    });
  } catch (err) {
    console.log(err);
  }
}
run().catch((err) => console.log(err));

app.listen(port, () => {
  console.log("server running on port ", port);
});
