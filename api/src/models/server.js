require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const routes = require('./routes');

const app = express();
app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/rfid';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('Mongo connected'))
  .catch(err => { console.error(err); process.exit(1); });

app.use('/api', routes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`API listening ${PORT}`));
