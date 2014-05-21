'use strict'


exports.protectAjax = function(req, res, next) {
    if (req.xhr) {
        next();
    } else {
        res.status(403).render('403.jade', {title: '403 | Forbidden'});  
    }
}


exports.pageNotFound = function(req, res) {
    res.status(404).render('404.jade', {title: '404 | Page Not Found'});
}


exports.xsrfProtect = function(req, res, next) {
    res.cookie('XSRF-TOKEN', req.session._csrf);
    res.locals.csrftoken = req.session._csrf;
    next();
}
