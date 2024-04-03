const express = require('express')
const app = express();
require('dotenv').config()
const port = process.env.PORT || 4500;
const host = '192.168.0.23';


const cors = require('cors');
const bodyParser = require('body-parser');
const { authJWT } = require('./app/middleware/auth');


app.use(bodyParser.json());

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));




require('./app/routes/address')(app);
require('./app/routes/food/category')(app);
require('./app/routes/food/foodItem')(app);
require('./app/routes/media')(app);

app.use(authJWT)
require('./app/routes/user')(app);
require('./app/routes/auth')(app);
require('./app/routes/addToCart')(app);
require('./app/routes/wishList')(app);

require('./app/routes/order')(app);






app.get('*', (req, res) => {
    res.send({
        message: 'Hunn smart!',
        error: true,
    })
})


app.listen(port, host, () => console.log(`Server is running on ${host}:${port}`));