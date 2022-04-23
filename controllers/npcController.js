const NPC = require('../models/npc');
const Category = require('../models/category');
const async = require('async');

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
exports.npc_create_post = function(req, res) [

    
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