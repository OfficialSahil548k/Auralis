const express = require('express');
const app = express();
const mongoose = require('mongoose');
Port = 8800;
const listing = require('./models/listing.js');
const path = require('path');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'))
app.use(express.urlencoded({extended : true}));


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

app.get('/',(req,res)=>{
    res.send("welcome to wonderLust!");
});

app.get('/listing', async (req,res)=>{
    let allListing = await listing.find({});
    res.render('index.ejs',{allListing})
});

app.get('/listing/new', async (req,res) =>{
    console.log("opening new form")
    res.render('new.ejs');
});

app.get('/listing/:id', async (req,res) =>{
    let {id} = req.params;
    const list = await listing.findById(id);
    res.render('show.ejs',{list});
});

app.post('/listing', async(req,res)=>{
    let { title, description, price, location, country} = await req.body;
    await listing.insertOne({
        title : title,
        description : description,
        price : price,
        location : location,
        country : country
    });
    res.redirect('/listing');
})

app.get('/listing/:id/edit', async (req,res) =>{
    let {id} = req.params;
    let list = listing.find({id : id});
    res.render('edit.ejs',list);
});
app.listen(Port,  () =>{
    console.log(`app is running on http://localhost:${Port}`);
});
