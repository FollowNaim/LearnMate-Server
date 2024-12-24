require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 5000;
const app = express();
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_TOKEN_SECRET;

app.use(
  cors({
    origin: ["https://learnmates.vercel.app", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

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

// verify token and access with middlewear
const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).send("Unauthorized Access");
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      res.status(401).send("unauthorized");
    } else {
      req.decoded = decoded;
      next();
    }
  });
};

async function run() {
  try {
    client.connect();
    console.log("mongodb connected successfully");
    const db = client.db("learnMate");
    const usersCollection = db.collection("users");
    const tutorsCollection = db.collection("tutors");
    const bookingsCollection = db.collection("bookings");

    // get all users from db
    app.get("/users", async (req, res) => {
      const result = (await usersCollection.countDocuments()).toString();
      res.send(result);
    });
    // save per user to db
    app.post("/user", async (req, res) => {
      const user = req.body;

      const exists = await usersCollection.findOne({ email: user.email });
      if (exists) return;
      await usersCollection.insertOne(req.body);
    });
    // update saved user immediatly
    app.patch("/user", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.updateOne(
        { email: user.email },
        { $set: { name: user.name } }
      );

      res.send(result);
    });
    // generate jwt for secure data transmission
    app.post("/jwt", (req, res) => {
      const data = req.body;
      const token = jwt.sign(data, secret, { expiresIn: "5h" });
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    });

    // delete token when logout
    app.get("/clearjwt", (req, res) => {
      res.clearCookie("token").send({ success: true });
    });

    // get all tutors
    app.get("/tutors", async (req, res) => {
      const category = req.query.category;
      const count = req.query.count;
      const reviews = req.query.reviews;
      const search = req.query.search;

      let query = {};
      if (category) {
        query.category = category;
      } else {
        query = {};
      }
      if (search) {
        const result = await tutorsCollection
          .find({ category: { $regex: search, $options: "i" } })
          .toArray();

        return res.send(result);
      }
      if (count) {
        const counts = (await tutorsCollection.countDocuments()).toString();
        return res.send(counts);
      }
      if (reviews) {
        const r = await tutorsCollection
          .aggregate([
            {
              $group: { _id: "", review: { $sum: "$review" } },
            },
          ])
          .toArray();
        return res.send(r);
      }
      const result = await tutorsCollection.find(query).toArray();
      res.send(result);
    });
    // get all tutors count
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
      console.log(id);
      const result = await tutorsCollection.findOne({ _id: id });
      console.log(result);
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
    // get all categories
    app.get("/categories", async (req, res) => {
      const aggretionResutl = await tutorsCollection
        .aggregate([
          {
            $group: {
              _id: "$category",
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              category: "$_id",
              count: 1,
              _id: 0,
            },
          },
        ])
        .toArray();

      const result = aggretionResutl.reduce((acc, item) => {
        acc[item.category] = item.count;
        return acc;
      }, {});

      res.send(result);
    });
    // update reveiw
    app.patch("/update-review/:id", async (req, res) => {
      const id = req.params.id;
      // update on tutors collection
      const result = await tutorsCollection.updateMany(
        { _id: new ObjectId(id) },
        { $inc: { review: 1 } }
      );

      // update on bookings collection both on same time
      await bookingsCollection.updateMany(
        { tutorId: id },
        { $inc: { review: 1 } }
      );
      res.send(result);
    });
    // get my tutorials
    app.get("/my-tutorials/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const decoded = req.decoded;
      if (decoded.email !== email)
        return res.status(403).send("forbidden access");
      const result = await tutorsCollection.find({ email }).toArray();
      res.send(result);
    });
    // delete my tutorial
    app.delete("/tutors/:id", async (req, res) => {
      const result = await tutorsCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });
    // get all booking data
    app.get("/bookings", verifyToken, async (req, res) => {
      const email = req.query.email;
      const decoded = req.decoded;
      if (decoded.email !== email)
        return res.status(403).send("forbidden access");
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
        return res.status(409).send("You have already booked this tutor!");
      const prev = await tutorsCollection.findOne({
        _id: new ObjectId(details.tutorId),
      });
      await tutorsCollection.updateMany(
        { _id: new ObjectId(details.tutorId) },
        { $inc: { bookings: 1 } }
      );
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
