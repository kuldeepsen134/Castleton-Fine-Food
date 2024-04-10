const express = require('express')
const app = express();
require('dotenv').config()



const cors = require('cors');
const bodyParser = require('body-parser');
const { authJWT } = require('./app/middleware/auth');

const { config } = require('./app/config/config');
const {serverPort} =config;

app.use(bodyParser.json())

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "HEAD", "PUT", "PATCH", "DELETE"],
    credentials: true
}));




require('./app/routes/address')(app);
require('./app/routes/food/category')(app);
require('./app/routes/food/foodItem')(app);
require('./app/routes/media')(app);
require('./app/routes/policy')(app);

require('./app/routes/order')(app);

app.use(authJWT);

require('./app/routes/user')(app);
require('./app/routes/auth')(app);
require('./app/routes/addToCart')(app);
require('./app/routes/wishList')(app);







app.get('*', (req, res) => {
    res.send({
        message: 'Hunn smart!',
        error: true,
    })
})


app.listen(serverPort, () => console.log(`Server is running port on ${serverPort}`));