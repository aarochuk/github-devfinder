import express from "express";
import axios from "axios";

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res)=>{
    res.render("index.ejs")
})

app.post('/', async(req, res)=>{
    if(req.body.username.length === 0){
        var errorMessage = "Please input a github username to search";
    }else{
        var user = req.body.username;
    }
    try{
        const response = await axios.get(`https://api.github.com/users/${user}`);
        var created_date = new Date(response.data.created_at).toDateString()
        const data = {
            "username": response.data.login,
            "avatar": response.data.avatar_url,
            "name": response.data.name ? response.data.name : response.data.login,
            "github_url": response.data.html_url,
            "bio": response.data.bio ? response.data.bio : "This profile has no bio", 
            "repos": response.data.public_repos,
            "followers": response.data.followers,
            "following": response.data.following,
            "created": created_date,
            "location": response.data.location ? response.data.location : "No Data",
            "twitter": response.data.twitter_username ? response.data.twitter_username : "No Data",
            "website": response.data.blog.length > 0 ? response.data.blog : "No Data",
            "email": response.data.email ? response.data.email : "No Data",
        }
        console.log(data)
        res.render("index.ejs", {data: data});
    }catch(error){
        res.render("index.ejs", {message: "The user you searched for was not found"});
    }
})

app.listen(3000)