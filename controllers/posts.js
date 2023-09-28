import mongoose from 'mongoose';
import PostMessage from '../models/postMessages.js';

export const getPosts = async (req, res) => {
  const { page } = req.query;

  try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT; // starting index of every page
    const total = await PostMessage.countDocuments({}); // total number of documents in database
    // Sort: newest to oldest: -1 give us the newest first, and fetch 8 post, skip startIndex posts(page2: get 8-16)
    const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

    res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await PostMessage.findById(id);

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;
  try {
    const title = new RegExp(searchQuery, 'i'); // Test. test. TEST -> test
    const posts = await PostMessage.find({ $or: [{ title }, { tags: { $in: tags.split(',') } }] });
    res.json({ data: posts });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

// query -> /posts?page=1 -> page =1
// params -> /posts/123  -> id = 123

export const createPost = async (req, res) => {
  const post = req.body;

  const newPost = new PostMessage({ ...post, creator: req.userId });
  try {
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
    res.send(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');

  const updatePost = await PostMessage.findByIdAndUpdate(_id, post, { new: true });
  res.status(200).json(updatePost);
};

export const deletePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');
  const deletePostPost = await PostMessage.findByIdAndDelete(_id);
  res.json({ message: 'Post deleted successfully' });
};

export const likePost = async (req, res) => {
  const { id: _id } = req.params;

  if (!req.userId) return res.json({ message: 'Unauthenticated' });

  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');

  const post = await PostMessage.findById(_id);

  const index = post?.likes.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    // Already like a post
    post.likes.push(req.userId);
  } else {
    // dislike a post
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }
  // the post here is already have the update of likes
  const updatePost = await PostMessage.findByIdAndUpdate(_id, post, { new: true });

  res.status(200).json(updatePost);
};

export const commentPost = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  try {
    const post = await PostMessage.findById(id);

    post.comments.push(value);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);
  } catch (error) {
    console.log(error);
  }
};
