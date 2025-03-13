exports.getLogout = (req, res) => {
    req.session.destroy((err) => {
        if(err){
            console.error(err);
            return res.status(500).send('Erreur serveur');
        }
    });
    res.redirect('/');
}