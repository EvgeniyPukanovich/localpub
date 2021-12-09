let TimeTable = require('../models/time_table');
let Table = require('../models/table');
let Customer = require('../models/customer');

var async = require('async');

// Display list of all Waiters.
exports.time_table_list = function(req, res) {
    let lst = []
    Customer.find({}).exec(function(err, result) {
        if (err) { return next(err); }
        lst = result;
    })
    console.log(lst);

    TimeTable.find({})
        .populate('table')
        .populate('customer')
        .exec(function(err, list) {
            let possibleTime = [];

            for (let i = 12; i < 24; i++) {
                possibleTime.push(i);
            }

            Table.find({}, 'number capacity location')
                .sort({ number: 1 })
                .exec(function(err, list_tables) {
                    if (err) { return next(err); }
                    let lst = list_tables;
                    // console.log(list)
                    // console.log(lst);
                    res.render('time_table', { time_table_list: list, tables: lst, times: possibleTime });
                });

            if (err) { return next(err); }
            //Successful, so render
        });
};

exports.time_table_reserve = function(req, res) {
    console.log(req.body);
    let time_from = Number(req.body.time_from);
    let time_to = Number(req.body.time_to);
    if (time_from === time_to || time_to < time_from) {
        res.send("Некорректный ввод");
        return;
    }
    TimeTable.find()
        .populate({
            path: 'table',
            match: {
                number: req.body.table_number
            }
        })
        .populate('customer')
        .exec(function(err, time_tables) {
            tables = time_tables.filter(function(time_table) {
                return time_table.table; // return only users with email matching 'type: "Gmail"' query
            });
            console.log(tables[0]);
            if (err) {
                res.send(err);
            } else {
                let desiredTime = [];

                for (let i = time_from; i < time_to; i++) {
                    desiredTime.push(i);
                }

                let reserved_time = [];
                console.log(desiredTime);

                tables.forEach(element => {
                    let start_hour = element.reservation_date_from.getHours();
                    let end_hour = element.reservation_date_to.getHours();

                    for (let i = start_hour; i < end_hour; i++) {
                        reserved_time.push(i);
                    }
                });
                console.log(reserved_time);

                let intersection = desiredTime.filter(x => reserved_time.includes(x));

                if (intersection.length == 0) {
                    let customer = new Customer({
                        first_name: req.body.client_name,
                        last_name: 'jjj'
                    })
                    customer.save(function(err) {
                        if (err) { return next(err); }
                        // Successful - redirect to new author record.
                        console.log('created customer')
                    });
                    console.log(customer);
                    var from = new Date();
                    from.setHours(time_from, 0, 0);
                    console.log(from);
                    var to = new Date();
                    to.setHours(time_to, 0, 0);
                    console.log(to);
                    let time_table = new TimeTable({
                        table: tables[0].table,
                        customer: customer,
                        reservation_date_from: from,
                        reservation_date_to: to,
                    });
                    time_table.save(function(err) {
                        if (err) { return next(err); }
                        console.log('created time_table')
                    })
                    console.log(time_table);
                    res.send('Вы успешно записались');
                } else {
                    res.send('Это время уже занято. Выберете другое время');
                }
                console.log(intersection);
            }
        });

    // Table.findOne({ 'number': req.body.number }, function(err, doc) {
    //     console.log(doc);
    //     id = doc._id;
    //     TimeTable.findOneAndUpdate({ table: { '_id': id } }, { _12: "Reserved" },
    //         function(err, result) {
    //             if (err) {
    //                 res.send(err);
    //             } else {
    //                 res.send(result);
    //             }
    //         }
    //     );
    // });

    //TimeTable.updateOne({ number: 2 }, { $set: { _12: 'Reserved' } })
    //res.send('reserved');
}


// let mongoose = require('mongoose');
// let mongoDB = "";
// mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.Promise = global.Promise;
// mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// function customerCreate(first_name, last_name, cb) {
//     let waiter_detail = { first_name: first_name, last_name: last_name }

//     let customer = new Customer(waiter_detail);
//     customer.save(function(err) {
//         if (err) {
//             cb(err, null)
//             return
//         }
//         console.log('New Waiter: ' + customer);
//         customers.push(customer)
//         cb(null, customer)
//     });
// }

// function timetableCreate(table, customer, reservation_date_from, reservation_date_to, cb) {
//     let timetable_detail = {
//         table: table,
//         customer: customer,
//         reservation_date_from: reservation_date_from,
//         reservation_date_to: reservation_date_to,
//     }

//     let timetable = new TimeTable(timetable_detail);
//     timetable.save(function(err) {
//         if (err) {
//             cb(err, null)
//             return
//         }
//         console.log('New timetable: ' + timetable);
//         time_tables.push(timetable);
//         cb(null, timetable);
//     });
// }