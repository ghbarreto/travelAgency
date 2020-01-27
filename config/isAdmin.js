module.exports = {
    isAdmin: (req, res, next) =>{
        if(req.isAuthenticated() && req.user.isAdmin == true){
            return next();
        }
        else{
            req.flash('error_msg', 'You have to be an admin to view this resource');
            res.redirect('/users/login');
        }
    }
}