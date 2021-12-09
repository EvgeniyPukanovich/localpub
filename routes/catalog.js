let express = require('express');
let router = express.Router();

// Require controller modules.
let waiter_controller = require('../controllers/waiterController');
let timeTableController = require('../controllers/timeTableController');

/// WAITER ROUTES ///
router.get('/', waiter_controller.index);

router.get('/time_table', timeTableController.time_table_list);

router.post('/time_table', timeTableController.time_table_reserve)

// // GET request for list of all Waiter items.
// router.get('/waiters', (res, req, err) => {
//     if (err) return err;
//     waiter_controller.waiter_list;
// });

module.exports = router;