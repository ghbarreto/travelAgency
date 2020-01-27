module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        // if(req.isAuthenticated() && req.users.isAdmin == true){
        //     res.redirect('users/admin');
        // }
        req.flash('error_msg', 'Please log in to view this resource');
        res.redirect('/users/login');
    }
}