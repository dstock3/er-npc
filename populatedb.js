#! /usr/bin/env node

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require('async')
const NPC = require('./models/npc')
const Category = require('./models/category')

const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const npcs = []
const categories = []

function npcCreate(name, desc, category, loc, quote, notes, cb) {
  let npc = new NPC({name:name, desc:desc, category:category, loc:loc, quote:quote, notes:notes});
       
  npc.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New NPC: ' + npc);
    npcs.push(npc)
    cb(null, npc)
  }  );
}

function categoryCreate(name, cb) {
  let category = new Category({ name: name });
       
  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category);
  }   );
}

function createCategories(cb) {
  /*
  name, desc, category, loc, quote, notes
  */
    async.series([
        function(callback) {
          categoryCreate('Merchant', callback);
        },
        function(callback) {
          categoryCreate('Trainer', callback);
        },
        function(callback) {
          categoryCreate('Blacksmith', callback);
        },
        function(callback) {
          categoryCreate('Quest NPC', callback);
        },



        

        ],
        // optional callback
        cb);
}

function createNPCs(cb) {
  let Merchant = categories[0]
  let Trainer = categories[1]
  let BlackSmith = categories[2]
  let QuestNPC = categories[3]

  async.series([
      function(callback) {
        npcCreate(
          'MERCHANT KALÉ',
          `Merchant Kalé is a Merchant and NPC in Elden Ring. Merchant Kalé can be found in Limgrave: Church of Elleh.`, 
          Merchant, 
          'Church of Elleh in Limgrave', 
          `You are a Tarnished, I can see it. And I can also see... That you're not after my throat. Then why not purchase a little something? I am Kale, Purveyor of fine goods.`,
          `Upon travelling to the Mistwood Ruins and hearing a wolf's howl, Kalé gets a new dialogue option that unlocks the "Finger Snap" gesture, providing it without the need to kill him.`,
          callback);
      },
      function(callback) {
        npcCreate(
          'SORCERESS SELLEN', 
          `Sorceress Sellen is a Merchant and NPC in Elden Ring. Sorceress Sellen can be found in Limgrave, inside Waypoint Ruins which is far east from Elden Ring's starting point.`,
          Trainer,
          `The Waypoint Ruins in West Limgrave`, 
          `Tarnished, are we? A wonder you should turn up here. I am Sellen, a sorcerer, quite plainly. Why are you here?`,
          `Completing Sorceress Sellen's questline will cause Sir Gideon Ofnir, the All-Knowing to not be able to cast Comet Azur, as the corpse of Azur is missing, and the spell will no longer be obtainable.`,
          callback);
      },
      function(callback) {
        npcCreate(
          'SMITHING MASTER HEWG', 
          `Smithing Master Hewg is an NPC in Elden Ring. Smithing Master Hewg is a prisoner that can be found at the Roundtable Hold.`,
          BlackSmith,
          `Roundtable Hold`, 
          `Your divinity, have mercy, and grant me forgiveness. The road is yet long. A God not easily felled. But one day, without fail, you will have your wish. So please, grant me forgiveness, Queen Marika...`,
          `With your encouragement, Smithing Master Hewg will befriend Roderika and teach her the art of spirit tunining.`,
          callback);
      },
      function(callback) {
        npcCreate(
          'MIRIEL, PASTOR OF VOWS', 
          `Miriel, Pastor of Vows is an NPC in Elden Ring. Miriel, Pastor of Vows is the Church of Vow's steward, a huge Turtle wearing a mitre. They first interact with you when arriving at the Church of Vows.`,
          Trainer,
          `The Church of Vows in Liurna of The Lakes`, 
          `Heresy is not native to the world; it is but a contrivance. All things can be conjoined.`,
          `Miriel is a great candidate for dumping all your scrolls and prayerbooks onto as he does not change locations and teaches both Sorceries and Incantations.`,
          callback);
      },
      function(callback) {
        npcCreate(
          'DUNG EATER', 
          `Dung Eater is an NPC in Elden Ring. Dung Eater is a fellow Tarnished who occupies a corpse ridden room in the Roundtable Hold.`,
          QuestNPC,
          `Roundtable Hold`, 
          `A curse upon them all. They'll be born cursed, all of them. Along with their children, and their children's children, heh, for all time to come...`,
          `The spirit of Dung Eater can be summoned for aid in battle by using Dung Eater Puppet Ashes.`,
          callback);
      }
      ],
      // optional callback
      cb);
}

async.series([
  createCategories,
  createNPCs 
],

// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('NPCs: '+npcs);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




