const { Pool, Client } = require('pg')
require('dotenv').config()
// pools will use environment variables
// for connection information
const pool = new Pool({
    user:'postgres',
    password:'1234',
    database:'Yelp',
    port:5432,
    host:'localhost'
})
module.exports = {
    querry: (text,params) => pool.query(text,params)
}