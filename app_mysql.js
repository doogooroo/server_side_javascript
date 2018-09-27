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

app.set('views', './views_mysql');
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
app.get('/topic/add', function(req,res){
    var sql = "SELECT id, title FROM topic";
    
    con.query(sql, function(err, topics, fields){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error2');
        }
        res.render('add', {topics:topics })
    })
})

app.get('/topic/:id/add', function(req,res){
    var id = req.params.id;
    var sql = "SELECT title,description,author FROM topic where id =?";
    
    con.query(sql, [id], function(err, result, fields){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error2');
        }
        res.render('edit', {topics:result[0]})
    })
})

app.post('/topic/add', function(req,res){
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var sql = "INSERT INTO topic (title,description,author) VALUES(?,?,?)";
    //fs.writeFile('data/'+title, description, function(err){
    con.query(sql,[title,description,author], function(err,result,fields){   
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        res.redirect('/topic/'+result.insertId);
    })
})

app.get(['/topic/:id/edit'], function(req,res){
    var sql = "SELECT id, title FROM topic";
    
    con.query(sql, function(err, topics, fields){
        var id = req.params.id;

        if(id){
            var sql = "SELECT * FROM topic where id =?";
            con.query(sql, [id], function(err, rows, fields){
                if(err){
                    console.log(err);
                    res.status(500).send('Internal Server Error2');
                }else{
                    //console.log(rows[0].description);
                    res.render('edit', {topics:topics, topic:rows[0]} )
                }
            })
        }else{
            console.log(err);
            res.status(500).send('Internal Server Error2');
        }
    });
})

app.post(['/topic/:id/edit'], function(req,res){
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var id = req.params.id;
    var sql = 'UPDATE topic set title=?, description=?, author=? WHERE id = ?';

    con.query(sql, [title,description,author,id], function(err, rows, fields){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error2');
        } else{
            res.redirect('/topic/' + id);
        }
    })
})

app.get(['/topic/:id/del'], function(req,res){
    var sql = "SELECT id,title FROM topic";
    var id = req.params.id;
    con.query(sql, [id], function(err, topics, fields){
        var sql = 'SELECT * FROM topic WHERE id = ?';
        con.query(sql,[id], function(err,rows){
            if(err){
                console.log(err);
                res.status(500).send('Internal Server Error2');
            }else{
                if(rows.length === 0){
                    console.log(err + 'There is no rows');
                    res.status(500).send('Internal Server Error2');
                }else{
                    res.render('delete', {topics:topics, topic:rows[0]});
                }
            }
            
        })
        
    })
})

app.post(['/topic/:id/del'], function(req,res){
    var id = req.params.id;
    var sql = 'DELETE FROM topic WHERE id = ?';

    con.query(sql, [id], function(err, rows){
        res.redirect('/topic/');
        
    })
})



app.get(['/topic', '/topic/:id'], function(req,res){
    var sql = "SELECT id, title FROM topic";
    
    con.query(sql, function(err, topics, fields){
        var id = req.params.id;

        if(id){
            var sql = "SELECT * FROM topic where id =?";
            con.query(sql, [id], function(err, rows, fields){
                if(err){
                    console.log(err);
                    res.status(500).send('Internal Server Error2');
                }else{
                    res.render('view', {topics:topics, topic:rows[0]} )
                }
            })
        }else{
            res.render('view',  {topics:topics});
        }
    });
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
})