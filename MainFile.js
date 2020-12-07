var app = require("express")();
var express=require("express");
var mdn = require('mongodb').MongoClient;
app.set('view engine','ejs');
app.use( require("express").static( "public" ) );
app.use('/images', express.static(__dirname + 'public/images'))




app.get("/",(req,res)=>{
    res.render('welcome_new.ejs');
})
app.get('/LogIn',(req,res)=>{
    res.render("LogIn_new.ejs");    
})
app.get('/SignIn',(req,res)=>{
    res.render("SignIn_new.ejs");
})
app.get('/About',(req,res)=>{
    res.render("Terms_and_arguments.ejs");
})


app.get('/process',(req,res)=>{
    //console.log(req.query);
    mdn.connect('mongodb://localhost:27017',{useUnifiedTopology:true},function(err,client){
            if(err) throw err;
            var db = client.db('DogProject');
            db.collection('UsersList').insertOne(req.query,function(err){
                if(err) throw err
                else console.log("1 item successfully added");
                client.close();
            })
        })
        res.render("LogIn_new.ejs");
})
app.get('/process1',(req,res)=>{
    //console.log(req.query);
    mdn.connect('mongodb://localhost:27017',{useUnifiedTopology:true},function(err,client){
            if(err) throw err;
            var db = client.db('DogProject');
            db.collection('UsersList').find(req.query).toArray(function(err,docs){
                if(err) throw err
                if(docs.length==1){
                    res.render("Select_new.ejs");
                 }
                else{
                    res.render("LogIn_new.ejs");
                }
            })
        })
})



app.get("/dec1",(req,res)=>{
    mdn.connect('mongodb://localhost:27017',{useUnifiedTopology:true},function(err,client){
            if(err) throw err;
            var db = client.db('DogProject');
            db.collection('DogsList').find().toArray(function(err,docs){
                if(err) throw err
                //console.log(docs);
                //console.log(docs.length);
                res.render('Rent_new.ejs',{docs});
            })
        })
})


app.get("/dec2",(req,res)=>{
    res.render("Daycare.ejs");
})


// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const multer = require('multer');
// cloudinary.config({
//     cloud_name:'dn3a1cb9o',
//     api_key:377255288323517,
//     api_secret:'gV5WVqd-k9mYw_H8yF0HPrmJbfY'
// })
// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder: 'some-folder-name',
//       format: async (req, file) => 'png', // supports promises as well
//       public_id: (req, file) => 'computed-filename-using-request',
//     },
//   });
  
//   const parser = multer({ storage: storage });
  
//   app.post('/pro1', parser.single('file'), function (req, res) {
//     console.log("welcome");
//     var body=req.body;
//     body.path=req.file.path;
//     console.log(req.file.path);
//     console.log(body);
//     mdn.connect('mongodb://localhost:27017',{useUnifiedTopology:true},function(err,client){
//             if(err) throw err;
//             var db = client.db('DogProject');
//             db.collection('DogsList').insertOne(body,function(err){
//                 if(err) throw err
//                 else console.log("1 item successfully added");
//                 client.close();
//             })
//         })
//     res.render("Conform.ejs",{body,flag:1});
//   });


var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.png')
    }
});

var upload = multer({ storage: storage }).single('file');

app.post('/pro1', function (req, res) {
    upload(req, res, function (err) {
        if (err) {}
        var body=req.body;
        body.path=req.file.path.substr(14);
        console.log(req.file.path.substr(14));
        console.log(body);
        mdn.connect('mongodb://localhost:27017',{useUnifiedTopology:true},function(err,client){
                if(err) throw err;
                var db = client.db('DogProject');
                db.collection('DogsList').insertOne(body,function(err){
                    if(err) throw err
                    else console.log("1 item successfully added");
                    client.close();
                })
            })
        res.render("Conform.ejs",{body,flag:1});
    })
});




  var ObjectId = require('mongodb').ObjectID;
  app.get("/r/:id",(req,res)=>{
    //   console.log(req.params.id);
      mdn.connect('mongodb://localhost:27017',{useUnifiedTopology:true},function(err,client){
            if(err) throw err;
            var db = client.db('DogProject');
            db.collection('DogsList').findOne({_id:new  ObjectId(req.params.id)},function(err,docs){
                if(err) throw err
                console.log(docs);
                res.render("Details.ejs",{docs});
            })
        })
  })


app.get("/c/:id",(req,res)=>{
    mdn.connect('mongodb://localhost:27017',{useUnifiedTopology:true},function(err,client){
          if(err) throw err;
          var db = client.db('DogProject');
          db.collection('DogsList').find({_id:  ObjectId(req.params.id)}).toArray(function(err,docs){
              if(err) throw err
              res.render("Conform.ejs",{body:docs[0],flag:0});
          })
          db.collection('DogsList').deleteOne({_id:new  ObjectId(req.params.id)});
      })
})

app.listen(3000,()=>{
    console.log("The Server is up and running @ http://localhost:3000");
})