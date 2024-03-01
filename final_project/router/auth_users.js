const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });

    if(userswithsamename.length > 0){
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username && user.password === password
    });

    if(userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if(!isbn|!review|!username){
    return res.status(400).json({message: "Error: Invalid Request"});
  }

  if(books[isbn]){ 
    if(books[isbn].reviews[username]){
        books[isbn].reviews[username] = review;
        return res.status(200).json({message: "[Update] " + username + ": " + review });
    }else{
        books[isbn].reviews[username] = review;
        res.status(200).json({message: "[Create] " + username + ": " + review });
    }
  }

  return res.status(500).json({message: "Error: Books Not found"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
  
    if(!isbn|!username){
      return res.status(400).json({message: "Error: Invalid Request"});
    }
  
    if(books[isbn]){ 
      if(books[isbn].reviews[username]){
          delete books[isbn].reviews[username];
          return res.status(200).json({message: "Delete review success"});
      }else{
          res.status(500).json({message: "Error: Invalid Request" });
      }
    }
  
    return res.status(500).json({message: "Error: Books Not found"});
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
