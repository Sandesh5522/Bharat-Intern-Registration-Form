const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017";
const dbname = "nodereg";
const colname = "coll02";
const client = new MongoClient(uri);
const path = require('path');
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

function getData(db, body) {
    console.log("Data: ");
    bodyList = [];
    var result = db.collection(colname).find({"email":body.uemail,"password":body.upassword}).toArray().then((ans) => {
        console.log("ans: "+ans);
        console.log(ans[0].name);
        bodyList = [ans[0].name,ans[0].phone,ans[0].email,ans[0].password];
        console.log("bodyList: "+bodyList);
        // res.render('res.html',{bodyData:[ans[0].name,ans[0].phone,ans[0].email,ans[0].password]});
    });
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

app.post('/login', (req,res) => {
    client.connect();
    const db = client.db("nodereg");
    // const result = db.collection("coll02").find({"email":req.body.uemail,"password":req.body.upassword}).toArray();
    // const result = 
    getData(db, req.body);
    console.log("body: "+result);
    body = result.ans[0];
    // res.render('res.html',{bodyData:[req.body.uname,req.body.uphone,req.body.uemail,req.body.upassword]});
    res.render('res.html',{bodyData:[body.name,body.phone,body.email,body.password]});
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
