const express = require('express');
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Sample collection data for posts
let posts = [
  { id: 1, title: "Hello World", content: "This is my first post." },
  { id: 2, title: "Node.js Rocks", content: "Express makes Node.js easy!" },
  { id: 3, title: "JavaScript Tips", content: "Always use === instead of ==." },
  { id: 4, title: "Async/Await", content: "Asynchronous code made cleaner." },
  { id: 5, title: "REST APIs", content: "Building APIs with REST principles." }
];

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Post API!' });
});

// GET posts with filter (by title or content)
app.get('/posts/filter', (req, res) => {
  const { title, content } = req.query;

  let filteredPosts = posts;

  if (title) {
    filteredPosts = filteredPosts.filter(p =>
      p.title.toLowerCase().includes(title.toLowerCase())
    );
  }

  if (content) {
    filteredPosts = filteredPosts.filter(p =>
      p.content.toLowerCase().includes(content.toLowerCase())
    );
  }

  res.status(200).json(filteredPosts);
});

// GET all posts
app.get('/posts', (req, res) => {
  res.status(200).json(posts);
});

// GET a single post by ID
app.get('/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.status(200).json(post);
});

// POST a new post
app.post('/posts', (req, res) => {
  const { title, content } = req.body;
  const newPost = { id: posts.length + 1, title, content };
  posts.push(newPost);
  res.status(201).json(newPost);
});

// PUT update an existing post by ID
app.put('/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const { title, content } = req.body;
  post.title = title || post.title;
  post.content = content || post.content;

  res.status(200).json(post);
});

// DELETE a post by ID
app.delete('/posts/:id', (req, res) => {
  const postIndex = posts.findIndex(p => p.id === parseInt(req.params.id));
  if (postIndex === -1) return res.status(404).json({ message: 'Post not found' });

  posts.splice(postIndex, 1);
  res.status(200).json({ message: 'Post deleted successfully' });
});

// Catch-all route for invalid URLs
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

module.exports = app;
