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

// GET request for creating a Category. NOTE This must come before route that displays Categories (uses id).
router.get('/category/create', cat_controller.cat_create_get);

//POST request for creating Category.
router.post('/category/create', cat_controller.cat_create_post);

// GET request to delete Category.
router.get('/category/:id/delete', cat_controller.cat_delete_get);

// POST request to delete Category.
router.post('/category/:id/delete', cat_controller.cat_delete_post);

// GET request to update Category.
router.get('/category/:id/update', cat_controller.cat_update_get);

// POST request to update Category.
router.post('/category/:id/update', cat_controller.cat_update_post);

// GET request for one Category.
router.get('/category/:id', cat_controller.cat_detail);

// GET request for list of all Categories.
router.get('/categories', cat_controller.cat_list);