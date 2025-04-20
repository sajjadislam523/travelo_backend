const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello from the server!");
});

app.listen(port, () => {
    console.log(`SERVER is running on port ${port}`);
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.owq8r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        const packageCollection = client.db("traveloDB").collection("packages");

        app.get("/packages", async (req, res) => {
            const packages = await packageCollection.find().toArray();
            res.send(packages);
        });
    } finally {
        // Ensures that the client will close when you finish/error
    }
}
run().catch(console.dir);
