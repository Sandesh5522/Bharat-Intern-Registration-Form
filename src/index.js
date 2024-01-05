const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const validator = require("email-validator");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const path = require('path');
const { Redirect } = require('twilio/lib/twiml/VoiceResponse');
const app = express();
const port = 3000;

async function run() {
    try {
        await client.connect();
        const db = client.db("nodereg");
        const result = db.collection("coll02").find({}).toArray();
        console.log(result);
    }
    finally {
        setTimeout(() => {client.close()}, 1500);
        // await client.close();
    }
}
run().catch(console.dir);

function addData(db, body) {
    var dataobj = { name: body.uname, phone: body.uphone, email: body.uemail, password: body.upassword };
    var result = db.collection("coll02").insertOne(dataobj, function(err, res) {
        if (err) throw err;
        console.log("data inserted.");
        db.close();
    });
    // console.log("Added data:"+body);
}

app.use(bodyParser.urlencoded({ extended: true }), express.static('public'));

app.get('/', (req,res) => {
    const loginPage = path.resolve('views', 'login.html');
    res.sendFile(loginPage);
});

app.get('/register', (req,res) => {
    const filePath = path.resolve('views', 'register.html');
    res.sendFile(filePath);
});

app.post('/', (req,res) => {
    client.connect();
    const db = client.db("nodereg");
    const result = db.collection("coll02").find({"email":req.body.uemail,"password":req.body.upassword}).toArray();
    // console.log(result);
    res.render('res.html',{bodyData:[req.body.uname,req.body.uphone,req.body.uemail,req.body.upassword]});
});

app.engine('html', require('ejs').renderFile);
app.post('/register', (req,res) => {
    client.connect();
    const db = client.db("nodereg");
    // console.log(req.body.uname, req.body.uphone, req.body.uemail, req.body.upassword);
    addData(db, req.body);
    // res.redirect('/sent');// try sending registeration details.
    // res.render(__dirname,'/views/res.html',JSON.stringify({name:req.body}));
    res.render('res.html',{bodyData:[req.body.uname,req.body.uphone,req.body.uemail,req.body.upassword]});
});

app.get('/sent', (req,res) => {
    const resFile = path.resolve('views','res.html');
    // res.sendFile(resFile);
    // hpd = html.toString().replace("DATA", JSON.stringify(data))
    res.sendFile(resFile);
});

app.listen(port, () => {
    console.log(`App listening at port http://localhost:${port}`);
});
