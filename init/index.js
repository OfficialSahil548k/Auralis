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
    initdata.data = initdata.data.map((obj) => ({
        ...obj, 
        owner : "68b720186ab98acbf67efbaf",
    }));
    await listing.insertMany(initdata.data);
    console.log("data was initialized");
}

initDB();