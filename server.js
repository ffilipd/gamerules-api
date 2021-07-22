const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');
const axios = require('axios');
require ('dotenv').config();
const converter = require('./converter');

const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: '*',
    headers: "Access-Control-Allow-Headers, Origin, x-access-token, Content-Type, Accept",
    methods: 'POST, GET, PUT, DELETE',
};

app.use(cors(corsOptions));
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