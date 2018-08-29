var express = require('express');
var app = express();
var bodyParser = require('body-parser');
//var multer = require('multer');

app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.engine('pug', require('pug').__express)

app.get('/form_receiver', function(req,res){
    var title = req.query.title;
    var description = req.query.description;

    res.send(title + ',' + description);
})

app.post('/form_receiver', function(req,res){
    var title = req.body.title;
    var description = req.body.description;

    res.send(title+','+description);
});

app.get('/', function(req,res){
 res.send('Hello home page');
})

app.get('/topic/:id', function(req,res){
    var topics = [
        'Javascript is ...',
        'Expres is ...',
        'Node.js is ...'
    ];
    var output = `
        <a href="/topic/0">Javascript</a><br>
        <a href="/topic/1">Express is ...</a><br>
        <a href="/topic/2">Node.js is ...</a><br>
        ${topics[req.params.id]}
    `
    res.send(output);
})

app.get('/topic/:id/:mode', function(req,res){
    res.send(req.params.mode);
})

app.get('/form', function(req,res){
    res.render('form');
})

app.get('/template', function(req,res){
    res.render('index2', {time:Date(),title:'TitleTest'});
})

app.get('/index', function (req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!' })
  })

app.get('/route', function(req,res){
    res.send('Hello route, <img src=/camino.jpg>');
})

app.get('/dynamic', function(req,res){
    var lis = '';
    var time = Date();
    for(i =0; i<5; i++)
    {
        lis = lis + '<li>coding</li>';
    }
    
    var output = `
    <html>
        <head>
        </head>
        <title>
        </title>
        <body>
            Hello Dynamic!!
            <ul>${lis}</ul>
            ${time}
        </body>
    </html>`;
    res.send(output);
})

app.get('/login', function(req,res){
 res.send('<h1>Loign please<h1>');
})

app.listen(3000, function(){
 console.log('connected 3000 port');
})
