var express = require('express');
var session = require('express-session');
//var FileStore = require('session-file-store')(session);
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: '234241wwqrwasdf@#$',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'skagns486',
        database: 'o2'
    }),
    cookie: { secure: false } // session에 영향을 준다.
  }));


app.get('/count', function(req,res){
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count = 1;
    }
    
    res.send('count : ' + req.session.count);
})

app.get('/auth/login', function(req,res){
    var output = `
    <h1>Login Page</h1>
    <form action='/auth/login' method='post'>
        <div>
            <input type='text' name='username' placeholder="username"><br><br>
            <input type='text' name='password' placeholder='password'><br><br>
            <input type='submit' value='submit'>
        </div>
    </form>
    `;

    res.send(output);
})

app.post('/auth/login', function(req,res){
    var user = {
        username:'doogooroo',
        password:'1234',
        displayName:'Doogooroo'
    };
    var uname = req.body.username;
    var pw = req.body.password;

    if(uname === user.username && pw === user.password){
        req.session.displayName = user.displayName;
        req.session.save(function(){
            res.redirect('/welcome');
        })
        
    }else{
        res.send('Join us please!!<br><a href="/auth/login">Login</a>');
    }
})

app.get('/welcome', function(req,res){
    if(req.session.displayName){
        res.send(`
            <h1>Hello ${req.session.displayName}</h1>
            <a href="/auth/logout">Logout</a>
        `);
    }else{
        res.send(`
            <h1>Welcome</h1><br>
            <ul>
                <li><a href="/auth/login">Login</a></li>
                <li><a href="/auth/register">Register</a></li>
            </ul>
        `);
    }
})

app.get('/auth/logout', function(req,res){
    //req.session.destroy;
    delete req.session.displayName;

    req.session.save(function(){
        res.redirect('/auth/login');
    })
});

// Register
app.get('/auth/register',function(req,res){

})

app.listen(3003, function(){
    console.log('Connected 3003 port');
})
