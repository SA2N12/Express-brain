const User = require("../models/User");

exports.getUsers = async (req, res) => {
    try{
        const users = await User.find()
            .populate('team', 'name');
        res.render('admin/users.ejs',{
            users: users
        });
    }catch(err){
        console.error(err);
        res.status(500).send('Server Error');
    }
} 