const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const f = require('util').format;

// Connection URL
const user = encodeURIComponent(process.env.DB_USER);
const password = encodeURIComponent(process.env.DB_PASS);
const authMechanism = 'DEFAULT';
const url = f('mongodb://%s:%s@localhost:27017?authMechanism=%s',
    user, password, authMechanism);

// Database Name
const dbName = 'ppb';

module.exports.connect = async () => {
    const client = new MongoClient(url, {useUnifiedTopology: true});
    return client.connect().then((client)=>{
        let db = client.db(dbName)
        console.log('connected to db')
        return db;
    }).catch(err => {
        console.log(err)
    })
}



