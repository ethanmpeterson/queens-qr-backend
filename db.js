var mongoose = require('mongoose');
const usr = process.env.DB_USER;
const pwd = process.env.DB_PWD;


mongoose.connect("mongodb://" + usr + ":" + pwd + "@ds157544.mlab.com:57544/apscm3");