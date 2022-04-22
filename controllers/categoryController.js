const Category = require('../models/category');

// Display list of all Categories.
exports.cat_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Category list');
};

// Display detail page for a specific Category.
exports.cat_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Category detail: ' + req.params.id);
};

// Display Category create form on GET.
exports.cat_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Category create GET');
};

// Handle Category create on POST.
exports.cat_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Category create POST');
};

// Display Category delete form on GET.
exports.cat_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Category delete GET');
};

// Handle Category delete on POST.
exports.cat_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Category delete POST');
};

// Display Category update form on GET.
exports.cat_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Category update GET');
};

// Handle Category update on POST.
exports.cat_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Category update POST');
};