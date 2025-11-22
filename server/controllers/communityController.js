import CommunityPost from "../models/CommunityPost.js";

// @desc    Create a new post
// @route   POST /api/community
// @access  Private
export const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;

    const newPost = await CommunityPost.create({
      user: req.user._id,
      content,
      image,
    });

    const populatedPost = await CommunityPost.findById(newPost._id).populate(
      "user",
      "name avatar"
    );

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all posts
// @route   GET /api/community
// @access  Private
export const getPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find()
      .sort({ createdAt: -1 })
      .populate("user", "name avatar")
      .populate("comments.user", "name avatar");

    res.json(posts);
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Like/Unlike a post
// @route   PUT /api/community/:id/like
// @access  Private
export const likePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if post has already been liked
    if (post.likes.includes(req.user._id)) {
      // Unlike
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      // Like
      post.likes.push(req.user._id);
    }

    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error("Like post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add a comment
// @route   POST /api/community/:id/comment
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      user: req.user._id,
      content,
    };

    post.comments.push(newComment);
    await post.save();

    // Re-fetch to populate comment user
    const updatedPost = await CommunityPost.findById(req.params.id)
      .populate("user", "name avatar")
      .populate("comments.user", "name avatar");

    res.json(updatedPost.comments);
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
