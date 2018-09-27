var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var multer = require('multer');

var _storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
var upload = multer({ storage: _storage });

var mysql      = require('mysql');
var con = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'skagns486',
  database : 'o2'
});

con.connect();

app.set('views', './views_file');
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/user', express.static('uploads'));

app.listen(3000, function(){
    console.log('Connected, 3000 port');
})

app.get('/upload', function(req,res){
     res.render('uploadForm')
})

app.post('/uploadForm', upload.single('userFile'), function(req,res){
    console.log(req.file);
    res.send('Uploaded!!!' + req.originalname);
})

// 우선 순위 존재함!!! 
app.get('/topic/new', function(req,res){
    fs.readdir('data', function(err, files){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error2');
        }
        res.render('new',{topics:files});
    })
})

app.get(['/topic', '/topic/:id'], function(req,res){
    var sql = "SELECT id, title FROM topic";

    console.log('test1');

    con.query(sql, function(err, rows, fields){
        res.send(rows);
    });

    // fs를 이용한 방법
    // var id = req.params.id;
    // fs.readdir('data', function(err, files){
    //     if(err){
    //         console.log(err);
    //         res.status(500).send('Internal Server Error2');
    //     }
    //     if(id ){
    //         fs.readFile('data/'+id, 'utf8',function(err,data){
    //             if(err){
    //                 console.log(err);
    //                 res.status(500).send('Internal Server Error3');
    //             }
    //             res.render('view',  {topics:files, title:id, description:data});
    //         })
    //     }else{
    //         res.render('view', {topics:files, title:'Welcome', description:'Hello Javascript'});
    //     }
    // })
})

// app.get('/topic/:id', function(req,res){
//     var id = req.params.id;

//     fs.readdir('data', function(err, files){
//         if(err){
//             console.log(err);
//             res.status(500).send('Internal Server Error');
//         }
//         fs.readFile('data/'+id, 'utf8',function(err,data){
//             if(err){
//                 console.log(err);
//                 res.status(500).send('Internal Server Error');
//             }
//             res.render('view',  {topics:files, title:id, description:data});
//         })
//     })
// })



app.post('/topic', function(req,res){
    var title = req.body.title;
    var description = req.body.description;

    fs.writeFile('data/'+title, description, function(err){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        res.redirect('/topic/'+title);
    })
})``