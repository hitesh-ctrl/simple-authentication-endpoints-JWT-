const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "vfberbete"
const app = express();
const port = 3000;
app.use(express.json())
const users = []

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
        res.send({token});
    }
    else
        res.status(403).send({message:"Invalid Username or Password"})
});
app.get("/me",(req,res)=>{
    const token=req.headers.token;
    const decodedInfo = jwt.verify(token,JWT_SECRET)
    const username = decodedInfo.username
    let foundUser= users.find(user => user.username=username);
    if(foundUser){
        res.json({username: foundUser.username, password: foundUser.password})
    }
    else
        res.json({message:"token invalid"})
})
app.listen(port,()=>{
    console.log(`Server running at http://localhost:${ port }`)})