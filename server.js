const express = require('express');
const app = express();
const fs = require('fs');
const axios = require('axios');
require ('dotenv').config();

const converter = require('./ruleConverter')

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    axios.get(req.body.url)
    .then(result => {
        // console.log(result.data)
        let rules = converter(result.data);
        return rules;
    })
    .then(rules => {
         res.json(rules);
    }), (err) => {
         console.log(err);
    }
    
});

app.listen(PORT, () => {
    console.log("server running on port", PORT)
})