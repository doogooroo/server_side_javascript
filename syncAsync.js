var fs = require('fs');

console.log(1);
var data = fs.readFileSync('data1.txt', {encoding:'utf8'});

console.log(data);

console.log(2);
fs.readFile('data1.txt', {encoding:'utf8'}, function(err,data){
    console.log(3);
    console.log(data);
});
console.log(4);