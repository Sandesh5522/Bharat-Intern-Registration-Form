const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const path = require('path');
const app = express();
const port = 3000;

async function run() {
    try {
        await client.connect();
        const db = client.db("nodereg");
        const result = db.collection("coll01").find({}).toArray();
        console.log(result);
    }
    finally {
        await client.close();
    }
}
run().catch(console.dir);

function addData(db, body) {
    var dataobj = { name: body.uname, phone: body.uphone, password: body.upassword };
    var result = db.collection("coll01").insertOne(dataobj, function(err, res) {
        if (err) throw err;
        console.log("data inserted.");
        db.close();
    });
}

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req,res) => {
    const filePath = path.resolve(__dirname, 'home.html');
    res.sendFile(filePath);
});

app.post('/send', (req,res) => {
    client.connect();
    const db = client.db("nodereg");
    console.log(req.body.uname, req.body.uphone, req.body.upassword);
    addData(db, req.body);
});

app.listen(port, () => {
    console.log(`App listening at port http://localhost:${port}`);
});
