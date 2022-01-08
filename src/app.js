const express = require('express');
const userRoutes = require('./routes/user');
const app = express();
require("./db/dbconnect");
app.use(express.json());
app.use("/users",userRoutes);
module.exports = app;