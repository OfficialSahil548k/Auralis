const mongoose = require('mongoose');
const initdata = require('./data.js');
const listing = require('../models/listing.js');

const MongoURL = 'mongodb://127.0.0.1:27017/Auralis';


async function main(){
   await mongoose.connect(MongoURL);
}

main()
    .then(()=>{
        console.log("Connected to db");
    }).catch((err)=>{
        console.log(err);
    });


const initDB = async () => {
    await listing.deleteMany({});
    await listing.insertMany(initdata.data);
    console.log("data was initialized");
}

initDB();