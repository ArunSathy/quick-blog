import fs from 'fs'
import imagekit from '../config/imageKit.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import main from '../config/gemini.js';

// add a new blog 
export const addBlog = async (req, res) => {
    try {

        const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);

        const imageFile = req.file;

        // check if all fields are present

        if (!title || !description || !category || !imageFile) {
            return res.json({ success: false, message: 'Missing reqiured fields' })
        }

        const fileBuffer = fs.readFileSync(imageFile.path);

        // upload image to imagekit
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/blogs'
        })

        // optimization through imagekit URL transformation
        const optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { quality: 'auto' },
                { format: 'webp' },
                { width: '1280' }
            ]
        });

        const image = optimizedImageUrl;

        await Blog.create({ title, subTitle, description, category, image, isPublished });

        res.json({ success: true, message: 'Blog created successfully' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


// get all blog lists
export const getAllBlogs = async (req, res) => {
    try {

        const blogs = await Blog.find({ isPublished: true });

        res.json({ success: true, blogs })

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


// get individual blog data
export const getBlogById = async (req, res) => {
    try {

        const { blogId } = req.params;

        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.json({ success: false, message: "Blog not found" })
        }

        res.json({ success: true, blog })

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// delete any blog 
export const deleteBlogById = async (req, res) => {
    try {

        const { id } = req.body;

        await Blog.findByIdAndDelete(id);

        // delete all comments associated with the blog

        await Comment.deleteMany({blog: id});

        res.json({ success: true, message: "Blog deleted successfully" })

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


// publishing/unpublishing the blog
export const togglePublish = async (req, res) => {
    try {

        const { id } = req.body;

        const blog = await Blog.findById(id);

        blog.isPublished = !blog.isPublished;

        await blog.save();

        res.json({ success: true, message: 'Blog status updated' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


// add comment in the blog
export const addComment = async (req, res) => {
    try {

        const { blog, name, content } = req.body;

        await Comment.create({ blog, name, content });

        res.json({ success: true, message: 'Comment added for review' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// get individual blog comments
export const getBlogComments = async (req, res) => {
    try {

        const { blogId } = req.body;

        const comments = await Comment.find({blog: blogId, isApproved: true}).sort({createdAt: -1});

        res.json({success: true, comments})

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// generate AI content
export const generateAIContent = async (req, res) => {
    try {
        const { prompt } = req.body;
        const content = await main(prompt + ' Generate a blog content for this topic in simple text format');

        res.json({success: true, content});

    } catch (error) {
        res.json({success: false, message: error.message});
    }
}