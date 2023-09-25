import jwt from "jsonwebtoken";

// If you want to like a post
// Click the like button => middleware(next) => like controllers
const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // token is the first element [Bear TOKEN]
        const isCustomAuth = token.length < 500; // if > 500 => this token was created by google

        let decodeData;
        if (token && isCustomAuth) {
            decodeData = jwt.verify(token, "test");

            req.userId = decodeData?.id;
        } else {
            decodeData = jwt.decode(token);
            // Check properties of decodeData here
            req.userId = decodeData?.sub;
        }

        next();
    } catch (error) {
        console.log(error);
    }
};

export default auth;
