const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async(req, res) => {
    try {
        return res.status(200).send(JSON.stringify(books, null, 3));
    } catch (error) {
        return res.status(500).json({message: error.message });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async(req, res) => {
    try {
        return res.status(200).send(JSON.stringify(books[req.params.isbn]));
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author', async(req, res) =>{
    try {
        const author = req.params.author;
        const filter_books = Object.values(books).filter(book => book.author === author);
        return res.status(200).send(JSON.stringify(filter_books, null, 3));
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
    
});

// Get all books based on title
public_users.get('/title/:title', async(req, res) =>{
    try {
        const title = req.params.title;
        const filter_books = Object.values(books).filter(book => book.title === title);
        return res.status(200).send(JSON.stringify(filter_books, null, 3));
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    return res.status(200).send(JSON.stringify(books[req.params.isbn].reviews));
});

module.exports.general = public_users;
