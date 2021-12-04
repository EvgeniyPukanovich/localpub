#! /usr/bin/env node

// Get arguments passed on command line
let userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

let async = require('async');
let Waiter = require('./models/waiter');
let Table = require('./models/table');
let TimeTable = require('./models/time_table');


let mongoose = require('mongoose');
let mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// let testWaiter = {

// }
// let testTable = {
//     _id: '61aa53be626abe7ad7d31181',
//     number: 3,
//     capacity: 2,
//     waiter: { type: Schema.Types.ObjectId, ref: 'Waiter', required: true },
//     location: { type: String },
// }
let waiters = [];
let tables = [];
let time_tables = [];

function waiterCreate(first_name, last_name, date_of_birth, cb) {
    let waiter_detail = { first_name: first_name, last_name: last_name }
    if (date_of_birth !== false) waiter_detail.date_of_birth = date_of_birth;
    if (date_of_birth !== false) waiter_detail.date_of_death = date_of_birth;

    let waiter = new Waiter(waiter_detail);
    waiter.save(function(err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Waiter: ' + waiter);
        waiters.push(waiter)
        cb(null, waiter)
    });
}

function tableCreate(number, capacity, waiter, location, cb) {
    let table_detail = {
        number: number,
        capacity: capacity,
        waiter: waiter,
        location: location
    }

    let table = new Table(table_detail);
    table.save(function(err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New table: ' + table);
        tables.push(table);
        cb(null, table);
    });
}

function timetableCreate(table, arr, cb) {
    let timetable_detail = {
        table: table,
        _12: arr[0],
        _14: arr[1],
        _16: arr[2],
        _18: arr[3],
        _20: arr[4],
        _22: arr[5]
    }

    let timetable = new TimeTable(timetable_detail);
    timetable.save(function(err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New timetable: ' + timetable);
        time_tables.push(timetable);
        cb(null, timetable);
    });
}

function createWaiters(cb) {
    async.series([
            function(callback) {
                waiterCreate('Patrick', 'Peters', '1996-06-06', callback);
            },
            function(callback) {
                waiterCreate('Ben', 'Davis', '2000-11-08', callback);
            },
            function(callback) {
                waiterCreate('Kate', 'Mills', '1993-01-02', callback);
            },
            function(callback) {
                waiterCreate('Betty', 'Bronte', '1999-09-13', callback);
            },
        ],
        // optional callback
        cb
    );
}

function createTables(cb) {
    async.parallel([
            function(callback) {
                tableCreate(1, 4, waiters[0], "Near the window", callback);
            },
            function(callback) {
                tableCreate(2, 6, waiters[1], "In the center of the hall", callback);
            },
            function(callback) {
                tableCreate(3, 2, waiters[2], "Next to the bar", callback);
            },
            function(callback) {
                tableCreate(4, 4, waiters[3], "In the corner of the hall", callback);
            }
        ],
        // optional callback
        cb);
}

function createTimeTables(cb) {
    async.parallel([
            function(callback) {
                timetableCreate(tables[0], ["Available", "Available", "Maintenance", "Maintenance", "Taken", "Taken"], callback)
            },
            // function(callback) {
            //     timetableCreate(tables[1], 'Maintenance', ['13:00', '15:00'], callback)
            // },
            // function(callback) {
            //     timetableCreate(tables[2], 'Available', ['10:00', '12:00', '16:00', '18:00'], callback)
            // },
            // function(callback) {
            //     timetableCreate(tables[3], 'Taken', ['20:00', '22:00'], callback)
            // }
        ],
        // optional callback
        cb);
}

async.series([
    createWaiters,
    createTables,
    createTimeTables
], function cb(err, results) {
    if (err) {
        console.log('FINAL ERR: ' + err);
    } else {
        console.log('It works!');
    }
    // All done, disconnect from database
    mongoose.connection.close();
});