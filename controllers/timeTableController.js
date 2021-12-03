let TimeTable = require('../models/time_table');

var async = require('async');


// Display list of all Waiters.
exports.time_table_list = function(req, res) {
    TimeTable.find({})
        .exec(function(err, list) {
            console.log(list)
            if (err) { return next(err); }
            //Successful, so render
            res.render('time_table', { time_table_list: list });
        });
};