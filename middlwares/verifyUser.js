
const authenticateUser = (req, res, next) => {
    const authToken = req.cookies._id;
    if (authToken) {
        return res.status(200).redirect("/home/page")
    }
    if (!authToken) {
        next();
    }
};

const checkUser = (req, res, next) => {
    const authToken = req.cookies._id;
    if (!authToken) {
        return res.status(200).redirect("/users/login/page")
    }
    if (authToken) {
        next();
    }
};
module.exports = { checkUser, authenticateUser }