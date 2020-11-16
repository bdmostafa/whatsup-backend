// Importing
import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import Messages from "./dbMessages.js";
import Pusher from "pusher";

// App config
const app = express();
const port = process.env.PORT || 4200;

const pusher = new Pusher({
  appId: "1108035",
  key: "6fba44253488d9d7fcc8",
  secret: "42f3f1e8444032a2470b",
  cluster: "ap1",
  useTLS: true,
});

// Middleware
app.use(express.json());
app.use(cors());

// For security purposes
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
})

// DB config
const connection_uri = `mongodb+srv://admin:b7WJkmEQMZDv5TcO@cluster0.qlvoh.mongodb.net/whatsupDb?retryWrites=true&w=majority`;

mongoose.connect(connection_uri, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", () => {
  console.log("DB connected");

  // collection from database
  const collectionMessages = db.collection("messagecontents");
  const changeStream = collectionMessages.watch();

  changeStream.on("change", (change) => {
    console.log(change);

    // Checking the changes type
    // If inserted, trigger msg thruogh pusher
    if (change.operationType === "insert") {
      const detailsMsg = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: detailsMsg.name,
        message: detailsMsg.message,
      });
    } else {
      console.log("Triggering Pusher Error");
    }
  });
});

// API routes
app.get("/", (req, res) => {
  res.status(200).send("hello programmer");
});

app.get("/messages/sync", (req, res) => {
  Messages.find((err, data) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(data);
  });
});

app.post("/messages/new", (req, res) => {
  const dbMessage = req.body;

  Messages.create(dbMessage, (err, data) => {
    if (err) res.status(500).send(err);
    else res.status(201).send(`New message created: \n ${data}`);
  });
});

// Listener
app.listen(port, () => console.log(`Listening to the local host : ${port}`));
