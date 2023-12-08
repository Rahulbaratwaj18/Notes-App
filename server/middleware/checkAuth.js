exports.isloggedIn = function(req,res,next){
    if(req.user){
        next();
    }
    else{
        res.status(401).send("Access Denied,Please Login or sign up First ");
    }
}