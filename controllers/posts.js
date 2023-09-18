import PostMessage from "../models/postMessages.js";

export const getPost = async (req, res) => {
    try {
        const postMessages = await PostMessage.find();

        res.status(200).json(postMessages);
    } catch (error) {
        res.send(404).json({ message: message.error.message });
    }
};

export const createPost = (req, res) => {
    res.send("Post creation");
};
