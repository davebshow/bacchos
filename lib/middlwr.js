exports.protectAjax = function(req, res, next) {
    var match = req.url.match(/^\/ajax\/.+/);
    if (match != null) {
        var is_ajax_request = req.xhr;
        if (is_ajax_request) {
            next();
        } else {
            console.log('Denied external request')
            res.status(403).render('403.jade', {title: '403 | Forbidden'})  
        }
    } else {
        next();
    }
}

exports.pageNotFound = function(req, res) {
    res.status(404).render('404.jade', {title: '404 | Page Not Found'});
}