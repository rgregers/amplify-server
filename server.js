const { exec } = require("child_process");
const cors = require("cors");
const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const app = express();
const port = 5001;
const upload = multer({dest: "uploads/"});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post("/", upload.array("file"), async (req, res) => {
    fs.readFile(req.files[0].path, "utf-8", (err, data) => {
        const result = [];
        if (err) {
            console.log(err);
            res.status(500).send();
        }
        const split = data.split(/\r?\n/);
        const seqs = [];
        var seq = "";
        for (i = 0; i < split.length; i++) {
            if (split[i][0] == ">") {
                if (i != 0) {
                    seqs.push(seq);
                    seq = "";
                }
            }
            else {
                seq += split[i].trim()
            }
        }
        seqs.push(seq);
        for (i = 0; i < seqs.length; i++) {
            if (seqs[i].includes(req.body.motif)) {
                result.push(seqs[i]);
            }
        }
        res.status(201).send(result);
    });
})

app.listen(process.env.PORT || port, () => {
    console.log("REST API is listening");
})
