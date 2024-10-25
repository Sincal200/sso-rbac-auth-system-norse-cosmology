const { getUsername } = require('./globalUsername');

const addUserMiddleware = (req, res, next) => {
    req.body.user = getUsername();
    next();
};

module.exports = addUserMiddleware;