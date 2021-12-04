let express = require('express');
let router = express.Router();

// Require controller modules.
let waiter_controller = require('../controllers/waiterController');
let timeTableController = require('../controllers/timeTableController');
//var author_controller = require('../controllers/authorController');
//var genre_controller = require('../controllers/genreController');
//var book_instance_controller = require('../controllers/bookinstanceController');

/// WAITER ROUTES ///
router.get('/', waiter_controller.index);

// GET request for creating a Waiter. NOTE This must come before routes that display Waiter (uses id).
router.get('/waiter/create', waiter_controller.waiter_create_get);

// POST request for creating Waiter.
router.post('/waiter/create', waiter_controller.waiter_create_post);

/// GET request to delete Waiter.
router.get('/waiter/:id/delete', waiter_controller.waiter_delete_get);

// POST request to delete Waiter.
router.post('/waiter/:id/delete', waiter_controller.waiter_delete_post);

// GET request to update Waiter.
router.get('/waiter/:id/update', waiter_controller.waiter_update_get);

// POST request to update Waiter.
router.post('/waiter/:id/update', waiter_controller.waiter_update_post);

// GET request for one Waiter.
router.get('/waiter/:id', waiter_controller.waiter_detail);

router.get('/waiters', waiter_controller.waiter_list);

router.get('/time_table', timeTableController.time_table_list);

router.post('/time_table', timeTableController.time_table_reserve)

// // GET request for list of all Waiter items.
// router.get('/waiters', (res, req, err) => {
//     if (err) return err;
//     waiter_controller.waiter_list;
// });

module.exports = router;