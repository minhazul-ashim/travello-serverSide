const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;

const app = express();

//Middlewares

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {

    res.send('The server is live and active')
})

app.listen(port, () => {

    console.log('The server is listening at port ', port)
})



