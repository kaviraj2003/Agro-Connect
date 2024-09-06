const express=require("express");
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
const multer=require("multer");
const fs=require("fs");
const path=require('path');
const cors=require("cors");


const app=express()
app.use(express.json());
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
mongoose.connect('mongodb://localhost:27017/agrodb');
var db=mongoose.connection;
db.on('error',()=>console.log("Error in Connecting to database"));
db.once('open',()=>console.log("Connected to Database"))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads'); // Store uploaded images in public/uploads folder
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Rename uploaded images
    }
});
const upload = multer({ storage:storage });

const user=new mongoose.Schema({
    name:String,
    email:String,
    shopname:String,
    place:String,
    district:String,
    phone:String,
    password:String,
})
const User=mongoose.model('User',user);

const post=new mongoose.Schema({
    name:String,
    email:String,
    shopname:String,
    place:String,
    district:String,
    phone:String,
    product:String,
    productquantity:Number,
    image:String
})
const post1=new mongoose.Schema({
    name:String,
    email:String,
    place:String,
    district:String,
    farmerphone:String,
    product:String,
    productquantity:Number,
    image:Array,
    length:Number

})
const post2=new mongoose.Schema({
    name:String,
    email:String,
    shopname:String,
    place:String,
    district:String,
    wholesalerphone:String,
    product:String,
    productquantity:Number,
    image:Array,
    status:String,
    length:Number

})
const trans=new mongoose.Schema({
    SenderAccName:String,
    SenderAccNum:String,
    SBank:String,
    SIFSC:String,
    SBankbranch:String,
    Transamount:String,
    ReceiverAccName:String,
    ReceiverAccNum:String,
    RBank:String,
    RIFSC:String,
    RBankbranch:String

})

const Post=mongoose.model('Post',post);
const Post1=mongoose.model('Post1',post1);
const Post2=mongoose.model('Post2',post2);
const Trans=mongoose.model('Trans',trans);

app.post("/register",(req,res)=>{
    var name=String(req.body.name);
    var email=String(req.body.email);
    var shopname=String(req.body.shopname);
    var place=String(req.body.place);
    var district=String(req.body.district);
    var phone=String(req.body.phone);
    var password=String(req.body.password);

    var data=new User({
        "name":name,
        "email":email,
        "shopname":shopname,
        "place":place,
        "district":district,
        "phone":phone,
        "password":password
    })
    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted successfully");
    })
    return res.redirect('main.html')
})
app.post("/login",(req,res)=>{
    var name=String(req.body.name);
    var phone=String(req.body.phone);
    var password=String(req.body.password);
    db.collection('users').find({"name":name,"phone":phone,"password":password},(err,user)=>{
        if(err){
            throw err;
        }
        if(user){
            console.log("Login successful");
            return res.redirect('main.html');
        }else{
            console.log(user);
            res.send('<script>alert("Login failed,Invalid name or password or phone");window.location.href="/agro1.html";</script>');
        }
    })

})
app.post("/add",upload.single('image'),(req,res)=>{
    var name=String(req.body.name);
    var email=String(req.body.email);
    var shopname=String(req.body.shopname);
    var place=String(req.body.place);
    var district=String(req.body.district);
    var phone=String(req.body.phone);
    var product=String(req.body.product);
    var productquantity=String(req.body.productquantity);
    var image=req.file.filename;
    const newpost=new Post({
        "name":name,
        "email":email,
        "shopname":shopname,
        "place":place,
        "district":district,
        "phone":phone,
        "product":product,
        "productquantity":productquantity,
        "image": image
    })
    db.collection('posts').insertOne(newpost,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record insertion successful");
    })
    return res.redirect('vege.html');

})
db.createCollection('Transactions');
app.post("/transact",(req,res)=>{
    var SenderAccName1=String(req.body.name);
    var SenderAccNum1=String(req.body.acnum);
    var SBank1=String(req.body.bank);
    var SIFSC1=String(req.body.ifsc);
    var SBankbranch1=String(req.body.branch);
    var Transamount1=String(req.body.amount);
    var ReceiverAccName1=String(req.body.rname);
    var ReceiverAccNum1=String(req.body.racnum);
    var RBank1=String(req.body.rbank);
    var RIFSC1=String(req.body.rifsc);
    var RBankbranch1=String(req.body.rbranch);
    const transaction=new Trans({
        "SenderAccName":SenderAccName1,
        "SenderAccNum":SenderAccNum1,
        "SBank":SBank1,
        "SIFSC":SIFSC1,
        "SBankbranch":SBankbranch1,
        "Transamount":Transamount1,
        "ReceiverAccName":ReceiverAccName1,
        "ReceiverAccNum":ReceiverAccNum1,
        "RBank":RBank1,
        "RIFSC":RIFSC1,
        "RBankbranch":RBankbranch1
    })
    
    db.collection('Transactions').insertOne(transaction,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted successful");
    })
})
let mobile='';

app.post("/add1",upload.array('image'),async(req,res)=>{
    let sts='Waiting';
    var name=String(req.body.name);
    var email=String(req.body.email);
    var shopname=String(req.body.shopname);
    var wholesalerphone=String(req.body.wholesale);
    var place=String(req.body.place);
    var district=String(req.body.district);
    var farmerphone=String(req.body.phone);
    var product=String(req.body.product);
    var productqu=Number(req.body.productqu);
    var status=sts;
    
    if(req.method==='POST'&&Boolean(req.body.sta)){
        sts=req.body.sta;
        let mobi=req.body.mob;
        db.collection(mobi).updateOne({ status:status}, { $set: {status:sts} });
        console.log(sts+mobi);
    }
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }
    const filenames=[];
    for(let i=0;i<req.files.length;i++){
        filenames.push(req.files[i].filename)
    }
    const image=filenames;
    
    const newpost1=new Post1({
        "name":name,
        "email":email,
        "place":place,
        "district":district,
        "farmerphone":farmerphone,
        "product":product,
        "productquantity":productqu,
        "image":image,
        "length":image.length
    })
    const newpost2=new Post2({
        "name":name,
        "email":email,
        "shopname":shopname,
        "place":place,
        "district":district,
        "wholesalerphone":wholesalerphone,
        "product":product,
        "productquantity":productqu,
        "image":image,
        "status":status,
        "length":image.length
    })
    var ph=String(req.body.phone);
    db.createCollection(ph);
    db.collection(ph).insertOne(newpost2,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record insertion successful");
    })
    var mobile=String(req.body.wholesale);
    db.createCollection(mobile);
    db.collection(mobile).insertOne(newpost1,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record insertion successful");
    })
    console.log(sts);
   
    
    res.status(200).send('<script>alert("data submitted");window.location.href="/vege.html";</script>')
})
let coll='';
let meth='';
app.all("/post1",async(req,res)=>{
    console.log("Request form post1");
    if(req.method==='POST'){
    coll=String(req.body.dbs);
    meth=String(req.body.met);
    }
    try{
        console.log(meth);
        if(meth==="Farmer"){
        const Post2=mongoose.model('Post2',post2,coll);
        const post3=await Post2.find();
        const postwithimage=post3.map(post=>{
            return{
                "name":post.name,
        "email":post.email,
        "shopname":post.shopname,
        "place":post.place,
        "district":post.district,
        "wholesalerphone":post.wholesalerphone,
        "product":post.product,
        "productquantity":post.productquantity,
        "image":post.image,
        "length":post.image.length,
        "status":post.status
            }
        })
        console.log("data received");
        res.json(postwithimage);
        }else{
            const Post1=mongoose.model('Post1',post1,coll);
        const post2=await Post1.find();
        const postwithimage=post2.map(post=>{
            return{
                "name":post.name,
        "email":post.email,
        "place":post.place,
        "district":post.district,
        "farmerphone":post.farmerphone,
        "product":post.product,
        "productquantity":post.productquantity,
        "image":post.image,
        "length":post.image.length
            }
        })
        console.log("data received");
        res.json(postwithimage);

        }
    }catch(err){
        console.error("Error in fetching data",err);
        res.status(500).send("Internal fetching error");
    }
});
app.get("/posts",async(req,res)=>{
    console.log("Received GET request to /users");
    try {
        const post1 = await Post.find();
        const postsWithImageData = post1.map(post => {
            return {
                "name":post.name,
        "email":post.email,
        "shopname":post.shopname,
        "place":post.place,
        "district":post.district,
        "phone":post.phone,
        "product":post.product,
        "productquantity":post.productquantity,
        "image": post.image
        }
        });
        res.json(postsWithImageData);
    } catch (err) {
        console.error("Error in fetching:", err);
        res.status(500).send("Internal fetching error");
    }
});
app.post('post3',(req,res)=>{
    if(req.method==='POST'&&req.body.mob){
        var status=sts;
        sts=req.body.sta;
        let mobi=req.body.mob;
        db.collection(mobi).updateOne({ status:status}, { $set: {status:sts} });
        console.log(sts+mobi);
    }
})
app.listen(3000);
console.log("Listening on Port 3000");