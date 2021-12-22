let Waiter = require('../models/waiter');

var async = require('async');

exports.index = function(req, res) {

    async.parallel({
        waiter_count: function(callback) {
            Waiter.countDocuments({}, callback);
        },
    }, function(err, results) {
        res.render('index', { title: 'Local Pub Home', error: err, data: results });
    });
};