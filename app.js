const express = require('express')
const app = express();
require('dotenv').config()
const port = process.env.PORT || 4500;
const host = '192.168.0.23';


const cors = require('cors');
const bodyParser = require('body-parser');
const { authJWT } = require('./app/middleware/auth');


app.use(cors());
app.use(bodyParser.json());
app.use(authJWT)

require('./app/routes/user')(app);
require('./app/routes/auth')(app);

require('./app/routes/address')(app);
require('./app/routes/food/category')(app);
require('./app/routes/food/foodItem')(app);










app.get('*', (req, res) => {
    res.send({
        message: 'Hunn smart!',
        error: true,
    })
})



app.listen(port, host, () => {
    console.log(`Server is running on ${host}:${port}`)
});