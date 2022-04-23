const NPC = require('../models/npc');
const Category = require('../models/category');
const async = require('async');
const { body,validationResult } = require("express-validator");

// Display list of all NPCs.
exports.npc_list = function(req, res) {
    async.parallel({
        npcs: function(callback) {
            NPC.find()
                .sort([['name', 'ascending']])
                .exec(callback)
        },
        categories: function(callback) {
            Category.find()
                .exec(callback)
        }
    }, function(err, results) {
        console.log(results.categories)
        res.render('index', { title: 'Elden Ring NPC Guide', error: err, npc_list: results.npcs, category_list: results.categories });
    });
};

// Display detail page for a specific NPC.
exports.npc_detail = function(req, res) {
    async.parallel({
        npc: function(callback) {
            NPC.findById(req.params.id, 'name desc category loc quote notes')
                .populate('name')
                .populate('desc')
                .populate('category')
                .populate('loc')
                .populate('quote')
                .populate('notes')
                .exec(callback)
        },
        category: function(callback) {
            Category.find({ 'category': req.params.id },'name')
                .exec(callback)
        }
    }, function(err, results) {
        res.render('npc_detail', { title: results.npc.name, error: err, npc: results.npc, category_list: results.category });
    });
};

// Display NPC create form on GET.
exports.npc_create_get = function(req, res) {
    Category.find()
        .exec(function(err, results) {
            res.render('npc_create', { title: "Create New NPC", error: err, category_list: results });
        })
};

// Handle NPC create on POST.
exports.npc_create_post = [
        //convert categories to array

        (req, res, next) => {
            if(!(req.body.category instanceof Array)){
                if(typeof req.body.category ==='undefined')
                req.body.category = [];
                else
                req.body.category = new Array(req.body.category);
            }
            next();
        },

        //form validation
        body('name', 'NPC name required').trim().isLength({ min: 1 }).escape(),
        body('desc', 'NPC description must not be empty.').trim().isLength({ min: 1 }).escape(),
        body('category', 'NPC category must not be empty.').trim().isLength({ min: 1 }).escape(),
        body('loc', 'NPC location must not be empty.').trim().isLength({ min: 1 }).escape(),

        (req, res, next) => {
            const errors = validationResult(req);

            //create new NPC object with the trimmed form data
            let npc = new NPC({ 
                name: req.body.name,
                desc: req.body.desc,
                category: req.body.category,
                loc: req.body.loc,
                quote: req.body.quote,
                notes: req.body.notes
            });

            if (!errors.isEmpty()) {
                Category.find()
                    .populate('name')
                    .exec(function (err, list_categories) {
                        if (err) { return next(err); }
    
                        for (let i = 0; i < list_categories.length; i++) {
                            if (npc.category.indexOf(list_categories[i]._id) > -1) {
                                list_categories[i].checked = 'true';
                            }
                        }
                        res.render('npc_create', { title: 'Create NPC', category_list: list_categories, npc: npc, errors: errors.array() })
                    })
            } else {
                npc.save(function (err) {
                    if (err) { return next(err); }
                    res.redirect(npc.url);
                });
            }
        }
];

// Display NPC delete form on GET.
exports.npc_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: NPC delete GET');
};

// Handle NPC delete on POST.
exports.npc_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: NPC delete POST');
};

// Display NPC update form on GET.
exports.npc_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: NPC update GET');
};

// Handle NPC update on POST.
exports.npc_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: NPC update POST');
};