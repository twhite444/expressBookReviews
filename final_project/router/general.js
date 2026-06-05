const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const getAllBooks = async () => {
  return books;
};

const getBookByISBN = async (isbn) => {
  return books[isbn];
};

const getBooksByAuthor = async (author) => {
  let matchingBooks = {};

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].author === author) {
      matchingBooks[isbn] = books[isbn];
    }
  });

  return matchingBooks;
};

const getBooksByTitle = async (title) => {
  let matchingBooks = {};

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].title === title) {
      matchingBooks[isbn] = books[isbn];
    }
  });

  return matchingBooks;
};





public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(200).json({ message: "User successfully registered" });
});

public_users.get('/', async function (req, res) {
  const allBooks = await getAllBooks();
  return res.status(200).send(JSON.stringify(allBooks, null, 4));
});

public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  const book = await getBookByISBN(isbn);

  if (book) {
    return res.status(200).send(JSON.stringify(book, null, 4));
  }

  return res.status(404).json({ message: "Book not found" });
});


public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  const matchingBooks = await getBooksByAuthor(author);

  if (Object.keys(matchingBooks).length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  }

  return res.status(404).json({ message: "No books found by this author" });
});

  
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  const matchingBooks = await getBooksByTitle(title);

  if (Object.keys(matchingBooks).length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  }

  return res.status(404).json({ message: "No books found with this title" });
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  }

  return res.status(404).json({ message: "Book not found" });
});
module.exports.general = public_users;
