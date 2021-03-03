// moudule providing objects and functions for routing
const express = require('express');
// import controller functions
const ctrl = require('../controllers/main');

const router = express.Router();

//GET
router.get('/', ctrl.doNothing);

router.get('/users', ctrl.getUsers);
router.get('/users/:ids', ctrl.getUsers);

router.get('/postings', ctrl.getPostings);
router.get('/postings/:ids', ctrl.getPostings);

//POST
router.post('/users', ctrl.addUser);


//testing
router.get('/hw', ctrl.getHelloWorld);
router.post('/pm', ctrl.postMessage);




module.exports = router;