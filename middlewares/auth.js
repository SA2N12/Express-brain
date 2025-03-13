module.exports = (req, res, next) => {
    console.log('Session user:', req.session.user); // Add debug logging
    res.locals.user = req.session.user || null;
    next();
};