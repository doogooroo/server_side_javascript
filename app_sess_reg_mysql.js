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

var users = [{
    username:'doogooroo',
    password:'1234',
    displayName:'Doogooroo'
},{
    username:'doogooroo1',
    password:'1111',
    displayName:'Doogooroo1'
},{
    username:'doogooroo2',
    password:'2222',
    displayName:'Doogooroo2'
}];

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
    var uname = req.body.username;
    var pw = req.body.password;

    for(var i=0; i<users.length; i++){
        var user = users[i];

        if(uname === user.username && pw === user.password){
            req.session.displayName = user.displayName;
            return res.redirect('/welcome');
        }
    }
    res.send('Join us please!!<br><a href="/auth/login">Login</a>');
    
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
    var output = `
        <h1>Register</h1>
        <form action="/auth/register" method="post">
            <p>
                <input type="text" name="username" placeholder="username">
            </p>
            <p>
                <input type="text" name="password" placeholder="password">
            </p>
            <p>
                <input type="text" name="displayName" placeholder="displayName">
            </p>
            <p>
                <input type="submit" value="submit">
            </p>
        </form>
    `;

    res.send(output);
})

app.post('/auth/register', function(req,res){
    var uname = req.body.username;
    var pw = req.body.password;
    var displayName = req.body.displayName;

    users.push({
        username:uname,
        password:pw,
        displayName:displayName
    });
    req.session.save(function(){
        req.session.displayName = displayName;

        res.redirect('/welcome');
    })
})

app.listen(3003, function(){
    console.log('Connected 3003 port');
})
