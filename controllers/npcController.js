const NPC = require('../models/npc');

// Display list of all NPCs.
exports.npc_list = function(req, res) {
    res.send('NOT IMPLEMENTED: NPC list');
};

// Display detail page for a specific NPC.
exports.npc_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: NPC detail: ' + req.params.id);
};

// Display NPC create form on GET.
exports.npc_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: NPC create GET');
};

// Handle NPC create on POST.
exports.npc_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: NPC create POST');
};

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