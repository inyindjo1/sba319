import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

await mongoose.connect(process.env.url)

console.log('MongoDB Connected')

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  publishedYear: Number,
  pages: Number,
  genre: String,
});

const Book = mongoose.model('Book', bookSchema);
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find({});  
    res.json(books);                    
  } catch (error) {
    res.status(500).json({ error: error.message });  
  }
});

app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found ' });
    res.json(book);
  } catch (error) {
    res.status(400).json({ error: 'Invalid book ID' });
  }
});
app.post('/books', async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.put('/books/:id', async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.delete('/books/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid book ID' });
  }
});
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/comments', async (req, res) => {
  try {
    const comments = await Comment.find({})
      .populate('userId', 'username name')      
      .populate('bookId', 'title author');      
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
