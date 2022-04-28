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
            NPC.findById(req.params.id, 'name desc category loc quote notes image')
                .populate('name')
                .populate('desc')
                .populate('category')
                .populate('loc')
                .populate('quote')
                .populate('notes')
                .populate('image')
                .exec(callback)
        },
        category: function(callback) {
            Category.find({ 'category': req.params.id },'name')
                .exec(callback)
        }
    }, function(err, results) {
        res.render('npc_detail', { title: results.npc.name + " | Elden Ring NPC Guide", error: err, npc: results.npc, category_list: results.category });
    });
};

// Display NPC create form on GET.
exports.npc_create_get = function(req, res, next) {
    Category.find()
        .exec(function(err, results) {
            res.render('npc_add', { title: "Add New NPC | Elden Ring NPC Guide", error: err, category_list: results });
        })
};

// Handle NPC create on POST.
exports.npc_create_post = [
        (req, res, next) => {
            if(!(req.body.category instanceof Array)){
                if(typeof req.body.category ==='undefined')
                req.body.category = [];
                else
                req.body.category = new Array(req.body.category);
            }
            next();
        },

        body('name', 'NPC name required').trim().isLength({ min: 1 }).escape(),
        body('desc', 'NPC description must not be empty.').trim().isLength({ min: 1 }).escape(),
        body('category', 'NPC category must not be empty.').trim().isLength({ min: 1 }).escape(),
        body('loc', 'NPC location must not be empty.').trim().isLength({ min: 1 }).escape(),

        (req, res, next) => {
            const errors = validationResult(req);

            let npc = new NPC({ 
                name: req.body.name,
                desc: req.body.desc,
                category: req.body.category,
                loc: req.body.loc,
                quote: req.body.quote,
                notes: req.body.notes,
                image: req.file.originalname
            });

            if (!errors.isEmpty()) {
                Category.find()
                    .populate('name')
                    .exec(function (err, list_categories) {
                        if (err) { return next(err); }
                        console.log(npc.category)
    
                        for (let i = 0; i < list_categories.length; i++) {
                            if (JSON.stringify(npc.category).indexOf(list_categories[i]._id) > -1) {
                                list_categories[i].checked = 'true';
                            }
                        }
                        res.render('npc_add', { title: "Add New NPC | Elden Ring NPC Guide", category_list: list_categories, npc: npc, errors: errors.array() })
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
    async.parallel({
        npc: function(callback) {
            NPC.findById(req.params.id, 'name desc category loc quote notes image')
                .populate('name')
                .populate('desc')
                .populate('category')
                .populate('loc') 
                .populate('quote')
                .populate('notes')
                .populate('image')
                .exec(callback)
        },
        category: function(callback) {
            Category.find({ 'category': req.params.id },'name')
                .exec(callback)
        }
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.npc==null) {
            res.redirect('/npc');
        }
        res.render('npc_delete', { title: 'Delete NPC | Elden Ring NPC Guide', npc: results.npc, category_list: results.category } );
    });
};

// Handle NPC delete on POST.
exports.npc_delete_post = function(req, res) {
    NPC.findById(req.body.npcid)
        .exec(function(err, results) {
            if (err) { return next(err); }
            else {
                NPC.findByIdAndRemove(req.body.npcid, function deleteNpc (err) {
                    if (err) { return next(err); }
                    res.redirect('/npc')
                });
            }
    });
};

// Display NPC update form on GET.
exports.npc_update_get = function(req, res, next) {
    async.parallel({
        npc: function(callback) {
            NPC.findById(req.params.id, 'name desc category loc quote notes image')
                .populate('name')
                .populate('desc')
                .populate('category')
                .populate('loc') 
                .populate('quote')
                .populate('notes')
                .populate('image')
                .exec(callback)
        },
        category: function(callback) {
            Category.find({ 'category': req.params.id },'name')
                .exec(callback)
        },
        categories: function(callback) {
            Category.find(callback);
        }
    }, function(err, results) {
            if (err) { return next(err); }
            if (results.npc==null) {
                var err = new Error('NPC not found');
                err.status = 404;
                return next(err);
            }

            for (let allCategoryIterations = 0; allCategoryIterations < results.categories.length; allCategoryIterations++) {          
                if (results.categories[allCategoryIterations]._id.toString()===results.npc.category._id.toString()) {
                    results.categories[allCategoryIterations].checked='true';
                }
            }
            res.render('npc_add', { title: 'Update NPC | Elden Ring NPC Guide', npc: results.npc, categories: results.categories, category_list: results.category });
    })
};

// Handle NPC update on POST.
exports.npc_update_post = [
    (req, res, next) => {
        if(!(req.body.category instanceof Array)){
            if(typeof req.body.category==='undefined')
            req.body.category=[];
            else
            req.body.category=new Array(req.body.category);
        }
        next();
    },

    body('name', 'NPC name required').trim().isLength({ min: 1 }).escape(),
    body('desc', 'NPC description must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('category', 'NPC category must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('loc', 'NPC location must not be empty.').trim().isLength({ min: 1 }).escape(),

    (req, res, next) => {
        let npc
        if (req.file) {
            npc = new NPC({ 
                name: req.body.name,
                desc: req.body.desc,
                category: (typeof req.body.category==='undefined') ? [] : req.body.category,
                loc: req.body.loc,
                quote: req.body.quote,
                image: req.file.originalname,
                notes: req.body.notes,
                _id:req.params.id 
            });
        } else {
            npc = new NPC({ 
                name: req.body.name,
                desc: req.body.desc,
                category: (typeof req.body.category==='undefined') ? [] : req.body.category,
                loc: req.body.loc,
                quote: req.body.quote,
                notes: req.body.notes,
                _id:req.params.id 
            });

        }

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            Category.find()
                .populate('name')
                .exec(function (err, list_categories) {
                    if (err) { return next(err); }

                    for (let i = 0; i < list_categories.length; i++) {
                        if (JSON.stringify(npc.category).indexOf(list_categories[i]._id) > -1) {
                            list_categories[i].checked = 'true';
                        }
                    }
                    res.render('npc_add', { title: 'Update NPC | Elden Ring NPC Guide', category_list: list_categories, npc: npc, errors: errors.array() })
                })
        }
        else {
            NPC.findByIdAndUpdate(req.params.id, npc, {}, function (err,thisnpc) {
                if (err) { return next(err); }
                   res.redirect(thisnpc.url);
                });
        }
    }
];