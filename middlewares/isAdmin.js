module.exports = (req, res, next) =>{
    if(req.session.user && req.session.user.admin == 'admin'){
        next();
    }else{
        res.redirect('/');
    }
}