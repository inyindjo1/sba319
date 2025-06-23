import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || process.env.url;

await mongoose.connect(MONGO_URI);
console.log('MongoDB Connected')
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  publishedYear: Number,
  pages: Number,
  genre: String,
});
bookSchema.index({ title: 1 });

const Book = mongoose.model('Book', bookSchema);

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  joined: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
commentSchema.index({ userId: 1 });
commentSchema.index({ bookId: 1 });

const Comment = mongoose.model('Comment', commentSchema);

app.get('/', (req, res) => {
  res.send('Welcome to the Book API');
});


app.get('/books', async (req, res) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(400).json({ error: 'Invalid book ID' });
  }
});

app.post('/books', async (req, res) => {
  try {
    if (req.body._id) delete req.body._id;
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/books/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid book ID' });
  }
});


app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'Invalid user ID' });
  }
});

app.post('/users', async (req, res) => {
  try {
    if (req.body._id) delete req.body._id;
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid user ID' });
  }
});


app.get('/comments', async (req, res) => {
  try {
    const comments = await Comment.find({})
      .populate('userId', 'name')
      .populate('bookId', 'title author');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/comments/:id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate('userId', 'name')
      .populate('bookId', 'title author');
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    res.json(comment);
  } catch (err) {
    res.status(400).json({ error: 'Invalid comment ID' });
  }
});

app.post('/comments', async (req, res) => {
  try {
    if (req.body._id) delete req.body._id;
    const newComment = new Comment(req.body);
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/comments/:id', async (req, res) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedComment) return res.status(404).json({ message: 'Comment not found' });
    res.json(updatedComment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/comments/:id', async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);
    if (!deletedComment) return res.status(404).json({ message: 'Comment not found' });
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid comment ID' });
  }
});

app.listen(PORT, () => {
  console.log('Listening on port:', PORT);
});

