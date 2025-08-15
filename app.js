const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Port = 8800;
const listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const engine = require('ejs-mate');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));
app.engine('ejs',engine);
app.use(express.static(path.join(__dirname,'/public')));

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
    res.render('listings/home.ejs');
});

app.get('/listing', async (req,res)=>{
    let allListing = await listing.find({});
    res.render('listings/index.ejs',{allListing})
});

app.get('/listing/new', async (req,res) =>{
    res.render('listings/new.ejs');
});

app.get('/listing/:id', async (req,res) =>{
    let {id} = req.params;
    const list = await listing.findById(id);
    res.render('listings/show.ejs',{list});
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
    const {id} = req.params;
    const list = await listing.findById(id);
    res.render('listings/edit.ejs',{list});
});

app.put('/listing/:id', async (req,res) =>{
    const {id} = await req.params;
    const {title, description, price, location, country} = await req.body;
    await listing.findOneAndUpdate({_id : id}, {title : title, description : description, price : price, location : location, country : country});
    res.redirect(`/listing/${id}`);
});

app.delete('/listing/:id', async (req,res)=>{
    const {id} = req.params;
    await listing.deleteOne({_id : id});
    console.log("Successfully deleted");
    res.redirect('/listing');
})

app.listen(Port,  () =>{
    console.log(`app is running on http://localhost:${Port}/`);
});
