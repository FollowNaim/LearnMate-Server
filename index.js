require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 5000;
const app = express();

app.use(
  cors({
    origin: ["https://learnmates.vercel.app", "http://localhost:5173"],
  })
);
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
    const bookingsCollection = db.collection("bookings");
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
    // update a tutorial
    app.put("/tutors/:id", async (req, res) => {
      const id = req.params.id;
      const details = req.body;
      const result = await tutorsCollection.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: details,
        },
        { upsert: true }
      );
      res.send(result);
    });
    // update reveiw
    app.patch("/update-review/:id", async (req, res) => {
      const id = req.params.id;
      const result = await tutorsCollection.updateMany(
        { _id: new ObjectId(id) },
        { $inc: { review: 1 } }
      );
      const result2 = await bookingsCollection.updateMany(
        { tutorId: id },
        { $inc: { review: 1 } }
      );
      console.log(id);
      console.log(result);
      console.log(result2);
      res.send(result);
    });
    // get my tutorials
    app.get("/my-tutorials/:email", async (req, res) => {
      const email = req.params.email;
      const result = await tutorsCollection.find({ email }).toArray();
      res.send(result);
    });

    // get all booking data
    app.get("/bookings", async (req, res) => {
      const email = req.query.email;
      let query = {};
      if (email) query.email = email;
      const result = await bookingsCollection.find(query).toArray();
      res.send(result);
    });
    // save booking data
    app.post("/bookings", async (req, res) => {
      const details = req.body;
      const exists = await bookingsCollection.findOne({
        email: details.email,
        tutorId: details.tutorId,
      });
      if (exists)
        return res.status(409).send("The data already exists in the database.");
      const prev = await tutorsCollection.findOne({
        _id: new ObjectId(details.tutorId),
      });
      details.review = prev.review;
      const result = await bookingsCollection.insertOne(details);
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
