const Category = require('../models/category');
const NPC = require('../models/npc');
const async = require('async');

// Display list of all Categories.
exports.cat_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Category List');

};

// Display detail page for a specific Category.
exports.cat_detail = function(req, res) {
    async.parallel({
        category: function(callback) {
            Category.findById(req.params.id)
                .exec(callback)
        },
        npcs: function(callback) {
            NPC.find()
                .exec(callback)
        },
        categories: function(callback) {
            Category.find()
                .exec(callback)
        }
    }, function(err, results) {
        let npcList = []

        for (let i=0; i < results.npcs.length; i++) { 
            if (JSON.stringify(results.npcs[i].category._id) === JSON.stringify(results.category._id)) {
                npcList.push(results.npcs[i])
            }
        }

        res.render('cat_detail', { title: results.category.name, error: err, npc_list: npcList, category: results.category, category_list: results.categories });
    });
};

// Display Category create form on GET.
exports.cat_create_get = function(req, res, next) {
    Category.find()
        .exec(function(err, results) {
            res.render('cat_add', { title: "Add New Category", error: err, category_list: results });
        })
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