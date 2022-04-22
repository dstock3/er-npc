const express = require('express');
const router = express.Router();

// Require controller modules.
const npc_controller = require('../controllers/npcController');
const cat_controller = require('../controllers/categoryController');

// NPC Routes

// GET request for creating an NPC. NOTE This must come before routes that display NPCs (uses id).
router.get('/npc/create', npc_controller.npc_create_get);

// POST request for creating an NPC.
router.post('/npc/create', npc_controller.npc_create_post);

// GET request to delete NPC.
router.get('/npc/:id/delete', npc_controller.npc_delete_get);

// POST request to delete NPC.
router.post('/npc/:id/delete', npc_controller.npc_delete_post);

// GET request to update NPC.
router.get('/npc/:id/update', npc_controller.npc_update_get);

// POST request to update NPC.
router.post('/npc/:id/update', npc_controller.npc_update_post);

// GET request for one NPC.
router.get('/npc/:id', npc_controller.npc_detail);

// GET npc home page.
router.get('/', npc_controller.npc_list);

// Category Routes