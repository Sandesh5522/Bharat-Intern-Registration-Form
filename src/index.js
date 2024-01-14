const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017";
const dbname = "nodereg";
const collname = "nodecoll";
const client = new MongoClient(uri);
const path = require('path');
const app = express();
const port = 3000;

async function run() {
    try {
        await client.connect();
        const db = client.db(dbname);
        const result = db.collection(collname).find({}).toArray();
        console.log(result);
    }
    finally {
        setTimeout(() => {client.close()}, 1500);
    }
}
run().catch(console.dir);

function addData(db, body) {
    var dataobj = { name: body.uname, phone: body.uphone, email: body.uemail, password: body.upassword };
    var result = db.collection(collname).insertOne(dataobj, function(err, res) {
        if (err) throw err;
        console.log("data inserted.");
        db.close();
    });
}

async function getData(db, body) {
    docs = {};
    query = { email: body.uemail, password: body.upassword };
    const result = db.collection(collname).find(query, {ordered: true});
    if((await db.collection(collname)) === 0) {
        console.log("No document found!!");
    }
    for await(doc of result) {
        docs = doc;
    }
}

app.use(bodyParser.urlencoded({ extended: true }), express.static('public'));

app.get('/login', (req,res) => {
    const loginPage = path.resolve('views', 'login.html');
    res.sendFile(loginPage);
});

app.get('/register', (req,res) => {
    const filePath = path.resolve('views', 'register.html');
    res.sendFile(filePath);
});

app.post('/login', async (req,res) => {
    client.connect();
    const db = client.db(dbname);
    await getData(db, req.body);
    console.log(docs);
    res.render('res.html',{bodyData:[docs.name,docs.phone,docs.email,docs.password]});
});

app.engine('html', require('ejs').renderFile);
app.post('/register', (req,res) => {
    client.connect();
    const db = client.db(dbname);
    addData(db, req.body);
    res.render('res.html',{bodyData:[req.body.uname,req.body.uphone,req.body.uemail,req.body.upassword]});
});

app.get('/sent', (req,res) => {
    const resFile = path.resolve('views','res.html');
    res.sendFile(resFile);
});

app.listen(port, () => {
    console.log(`App listening at port http://localhost:${port}/login \n http://localhost:${port}/register`);
});
