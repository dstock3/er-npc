const Category = require('../models/category');
const NPC = require('../models/npc');
const async = require('async');
const { body,validationResult } = require("express-validator");

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

        res.render('cat_detail', { title: results.category.name + " | Elden Ring NPC Guide", error: err, npc_list: npcList, category: results.category, category_list: results.categories });
    });
};

// Display Category create form on GET.
exports.cat_create_get = function(req, res, next) {
    Category.find()
        .exec(function(err, results) {
            res.render('cat_add', { title: "Add New Category | Elden Ring NPC Guide", error: err, category_list: results });
        })
};

// Handle Category create on POST.
exports.cat_create_post = [
    body('name', 'Category name required').trim().isLength({ min: 1 }).escape(),
    
    (req, res, next) => {
        const errors = validationResult(req);

        let category = new Category({
            name: req.body.name,
        });

        if (!errors.isEmpty()) {
            Category.find()
                .populate('name')
                .exec(function (err, results) {
                    if (err) { return next(err); }
                    res.render('cat_add', { title: "Add New Category | Elden Ring NPC Guide", category_list: results, errors: errors.array() });
                })
        } else {
            category.save(function(err) {
                if (err) { return next(err); }
                res.redirect(category.url);
            });
        }
    }
];

// Display Category delete form on GET.
exports.cat_delete_get = function(req, res, next) {
    async.parallel({
        category: function(callback) {
            Category.findById(req.params.id, 'name')
                .populate('name')
                .exec(callback) 
        },
        list_categories: function(callback) {
            Category.find({}, 'name')
                .populate('name')
                .exec(callback)
        },
        list_npcs: function(callback) {
            NPC.find({}, 'name category')
                .populate('name')
                .populate('category')
                .exec(callback)
        }
    }, function(err, results) {
        if (err) { return next(err); }
        let relNpcs = []
        for (let i = 0; i < results.list_npcs.length; i++) {
            if (results.list_npcs[i].category.name === results.category.name) {
                relNpcs.push(results.list_npcs[i])
            }
        }
        res.render('cat_delete', { title: 'Delete Category | Elden Ring NPC Guide', category: results.category, category_list: results.list_categories, npcs: relNpcs })
    })
};

// Handle Category delete on POST.
exports.cat_delete_post = function(req, res, next) {
    Category.findById(req.body.catid)
        .exec(function(err, results) {
            if (err) { return next(err); }
            // Success
            else {
                // Delete item and redirect to the list of npcs.
                Category.findByIdAndRemove(req.body.catid, function deleteCat (err) {
                    if (err) { return next(err); }
                    // Success - go to npc list
                    res.redirect('/npc')
                })
            }
        })
};

// Display Category update form on GET.
exports.cat_update_get = function(req, res, next) {
    async.parallel({
        category: function(callback) {
            Category.findById(req.params.id, 'name')
                .populate('name')
                .exec(callback) 
        },
        list_categories: function(callback) {
            Category.find({}, 'name')
                .populate('name')
                .exec(callback)
        },
        list_npcs: function(callback) {
            NPC.find({}, 'name category')
                .populate('name')
                .populate('category')
                .exec(callback)
        }
    }, function(err, results) {
        if (err) { return next(err); }
        let relNpcs = []
        for (let i = 0; i < results.list_npcs.length; i++) {
            if (results.list_npcs[i].category.name === results.category.name) {
                relNpcs.push(results.list_npcs[i])
            }
        }
        res.render('cat_add', { title: 'Update Category | Elden Ring NPC Guide', category: results.category, category_list: results.list_categories, npcs: relNpcs })
    })

};

// Handle Category update on POST.
exports.cat_update_post = [
    body('name', 'Category name required').trim().isLength({ min: 1 }).escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        let category = new Category({ 
            name: req.body.name,
            _id:req.params.id
        });

        if (!errors.isEmpty()) {
            Category.find()
                .populate('name')
                .exec(function (err, list_categories) {
                    if (err) { return next(err); }
                    res.render('cat_add', { title: 'Update Category', category_list: list_categories })
                })
        } else {
            // Data from form is valid. Update the record.
            Category.findByIdAndUpdate(req.params.id, category, {}, function (err,thiscat) {
                if (err) { return next(err); }
                   // Successful - redirect to item detail page.
                   res.redirect(thiscat.url);
                });
        }
    }

];
