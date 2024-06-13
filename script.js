const express = require('express')
const app = express()
// var viewEngine = require('view-engine');
const fs = require('fs');
const path=require('path');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));



app.get('/', function (req, res) {
    const arr = [];
    fs.readdir('./files',function(err,files){
      files.forEach(function(file){
       var data = fs.readFileSync(`./files/${file}`,"utf-8");
       arr.push({name:file , detail: data});
      })
      res.render("form",{files:arr});
    })
})

app.get('/read/:filename', function (req, res) {
  const fn = req.params.filename;
  fs.readFile(`./files/${fn}`,"utf-8",function(err,files){
   if(err) return res.status(500).send(err);
   else res.render("read",{name:req.params.filename, filedata:files})
  })
})


app.get('/delete/:filename',function(req,res){
  const filename = req.params.filename  ;
  fs.unlink(`./files/${filename}`,function(err){
    if(err) console.log(err)
    else res.redirect('/')
  })
})

app.get('/edit/:filename',function(req,res){
    res.render("edit",{filename: req.params.filename});
 
})

app.post('/edit',function(req,res){
   fs.rename(`./files/${req.body.previous}`,`./files/${req.body.new}`,function(err){
    res.redirect('/')
   })
})







app.post("/create",function(req,res){
  var fn = req.body.name.split(" ").join('')+".txt";
  fs.writeFile(`./files/${fn}`, req.body.detail, function(err){
    if(err) return res.status(404).send(err);
    else res.redirect("/")
  })
})
  
app.listen(3000)
