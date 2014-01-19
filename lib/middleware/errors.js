exports.protectAjax = function(req, res, next) {
    if (req.xhr) {
        next();
    } else {
        console.log('Denied external request');
        res.status(403).render('403.jade', {title: '403 | Forbidden'});  
    }
}


exports.pageNotFound = function(req, res) {
    res.status(404).render('404.jade', {title: '404 | Page Not Found'});
}
