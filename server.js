const express = require("express");
const cors = require("cors");
const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", async (req, res) => {
    res.status(201).send("CSC 448");
})

app.listen(process.env.PORT || port, () => {
    console.log("REST API is listening");
})
