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

function indexes(source, find) {
    if (!source) {
      return [];
    }
    // if find is empty string return all indexes.
    if (!find) {
      // or shorter arrow function:
      // return source.split('').map((_,i) => i);
      return source.split('').map(function(_, i) { return i; });
    }
    var result = [];
    for (i = 0; i < source.length; ++i) {
      // If you want to search case insensitive use 
      // if (source.substring(i, i + find.length).toLowerCase() == find) {
      if (source.substring(i, i + find.length) == find) {
        result.push(i);
      }
    }
    return result;
  }

app.post("/", upload.array("file"), async (req, res) => {
    fs.readFile(req.files[0].path, "utf-8", (err, data) => {
        const result = [];
        if (err) {
            console.log(err);
            res.status(500).send();
        }
        const split = data.split(/\r?\n/);
        var seq = "";
        for (i = 0; i < split.length; i++) {
            var header = null;
            if (split[i][0] == ">") {
                if (i != 0) {
                    header = split[i];
                    if (seq.includes(req.body.motif)) {
                        const index_list = indexes(seq, req.body.motif);
                        result.push([seq, index_list, header]);
                    }
                    seq = "";
                }
            }
            else {
                seq += split[i].trim()
            }
        }
        if (seq.includes(req.body.motif)) {
            const index_list = indexes(seq, req.body.motif);
            result.push([seq, index_list, header]);
        }
        // for (i = 0; i < seqs.length; i++) {
        //     console.log(seqs[i]);
        //     if (seqs[i].includes(req.body.motif)) {
        //         //get all indexes of motif in seqs[i]
        //         const index_list = indexes(seqs[i], req.body.motif);
        //         result.push([seqs[i], index_list]);
        //     }
        // }
        res.status(201).send(result);
    });
})

app.listen(process.env.PORT || port, () => {
    console.log("REST API is listening");
})
