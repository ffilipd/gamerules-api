const express = require('express');
const app = express();
const fs = require('fs');
const axios = require('axios');
require ('dotenv').config();

const converter = require('./ruleConverter');

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.post("/gamerules", (req, res) => {
    // require url from body
    axios.get(req.body.url)
    .then(result => {
        // convert text document to json
        let rules = converter(result.data);
        return rules;
    })
    .then(rules => {
        // return json
         res.json(rules);
    }), (err) => {
         console.log(err);
    }
    
});

app.listen(PORT, () => {
    console.log("server running on port", PORT)
})