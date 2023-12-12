const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const books = [
  { id: 1, title: 'Book 1' },
  { id: 2, title: 'Book 2' },
];

// Get all books
app.get('/books', (req, res) => {
  res.json(books);
});
document.cookie
// Get a specific book
app.get('/books/:id', (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) res.status(404).send('Book not found');
  res.json(book);
});

// Create a new book
app.post('/books', (req, res) => {
  const newBook = req.body;
  books.push(newBook);
  res.status(201).json(newBook);
});

// Update a book
app.put('/books/:id', (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) res.status(404).send('Book not found');

  // Update book properties
  book.title = req.body.title;

  res.json(book);
});

// Delete a book
app.delete('/books/:id', (req, res) => {
  const index = books.findIndex((b) => b.id === parseInt(req.params.id));
  if (index === -1) res.status(404).send('Book not found');

  // Remove the book
  books.splice(index, 1);

  res.send('Book deleted successfully');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
