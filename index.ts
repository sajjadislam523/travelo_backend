import cors from "cors";
import "dotenv/config";
import express, { type Request, type Response } from "express";
import { MongoClient, ServerApiVersion } from "mongodb";
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello from the server!");
});

app.listen(port, () => {
    console.log(`SERVER is running on port ${port}`);
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.owq8r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        app.get("/packages", async (req: Request, res: Response) => {
            const packages = await packageCollection.find().toArray();
            res.send(packages);
        });

        app.post("/packages", async (req: Request, res: Response) => {
            const pkg = req.body;
            const result = await packageCollection.insertOne(pkg);
            res.send(result);
        });
    } finally {
    }
}
run().catch(console.dir);
