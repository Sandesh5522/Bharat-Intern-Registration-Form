const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = requiere('mongodb');
const uri = "mongodb+srv://<user>:<password>@<cluster-url>?w=majority";
const client = new MongoClient(uri);
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req,res) => {
    // res.send('Hello World');
    const filePath = path.resolve(__dirname, 'home.html');
    res.sendFile(filePath);
});

app.post('/send', (req,res) => {
    console.log(req.body.uname, req.body.uphone, req.body.upassword);
})

app.listen(port, () => {
    console.log(`App listening at port http://localhost:${port}`);
});
