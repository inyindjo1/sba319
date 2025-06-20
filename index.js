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

