const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.get('/', (req,res) => {
    // res.send('Hello World');
    const filePath = path.resolve(__dirname, 'home.html');
    res.sendFile(filePath);
});

app.listen(port, () => {
    console.log(`App listening at port http://localhost:${port}`);
});
