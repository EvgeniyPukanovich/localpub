let TimeTable = require('../models/time_table');
let Table = require('../models/table');

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

exports.time_table_reserve = function(req, res) {
    console.log(req);
    Table.findOne({ 'number': req.body.number }, function(err, doc) {
        console.log(doc);
        id = doc._id;
        TimeTable.findOneAndUpdate({ table: { '_id': id } }, { _12: "Reserved" },
            function(err, result) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(result);
                }
            }
        );
    });

    //TimeTable.updateOne({ number: 2 }, { $set: { _12: 'Reserved' } })
    //res.send('reserved');
}