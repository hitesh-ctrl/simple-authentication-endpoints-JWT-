const express = require("express");
const jwt = require("jsonwebtoken");
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');const JWT_SECRET = "vfberbete"
const app = express();
const port = 3000;
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const users = []
const auth = (req,res,next)=>{
    const token=localStorage.getItem("token");
    if(token){
        jwt.verify(token,JWT_SECRET,(err,decoded)=>{
            if(err){
                res.status(401).send({message:"unauthorized"})
            }
            else
                req.user = decoded;
                next();

        })
    }
    else
        res.status(401).send({message:"unauthorized"})
}

app.post("/signup",(req,res)=>{
    const username = req.body.username
    const password = req.body.password
    users.push({
        username,
        password
    })
    res.send("Signed ujp!!")
})
app.post("/signin",(req,res)=>{
    const username = req.body.username
    const password = req.body.password

    const user=users.find(user => user.username===username && user.password===password);
    if(user){
        const token = jwt.sign({username:username},JWT_SECRET);
        user.token=token;
        localStorage.setItem("token", token);
        res.redirect("/me");
    }
    else
        res.status(403).send({message:"Invalid Username or Password"})
});
app.get("/me",auth,(req,res)=>{
    const user = req.user;
    res.send({username:user.username})
})
app.use(express.static("public"))
app.listen(port,()=>{
    console.log(`Server running at http://localhost:${ port }`)})