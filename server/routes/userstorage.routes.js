import express from 'express';
import { add_to_deck } from '../controllers/userstorage.controllers.js';
import { user } from '../controllers/userstorage.controllers.js';
import { cards } from '../controllers/userstorage.controllers.js';
import { mycards } from '../controllers/userstorage.controllers.js';
import { get_deck } from '../controllers/userstorage.controllers.js';

const router = express.Router();

router.post('/addtodeck', add_to_deck);
router.post('/user', user);
router.post('/cards', cards);
router.post('/mycards', mycards);
router.post('/getdeck', get_deck);

export default router;