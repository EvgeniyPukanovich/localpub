let express = require('express');
let router = express.Router();

// Require controller modules.
let home_page_controller = require('../controllers/homePageController');
let timeTableController = require('../controllers/timeTableController');

router.get('/', home_page_controller.index);

router.get('/time_table', timeTableController.time_table_list);

router.post('/time_table', timeTableController.time_table_reserve);

router.post('/time_table/get_time_from', timeTableController.get_time_from);

router.post('/time_table/get_time_to', timeTableController.get_time_to);

module.exports = router;