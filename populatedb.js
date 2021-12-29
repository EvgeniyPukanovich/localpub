#! /usr/bin/env node

// Get arguments passed on command line
let userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
}

let async = require('async');
let Table = require('./models/table');
let Customer = require('./models/customer');
let TimeTable = require('./models/time_table');


let mongoose = require('mongoose');
let mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

let customers = [];
let tables = [];
let time_tables = [];


function customerCreate(first_name, cb) {

    let customer_detail = { name: first_name }

    let customer = new Customer(customer_detail);
    customer.save(function(err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Waiter: ' + customer);
        customers.push(customer)
        cb(null, customer)
    });
}

function tableCreate(number, cb) {
    let table_detail = {
        number: number,
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

function timetableCreate(table, customer, reservation_date_from, reservation_date_to, code, cb) {
    let timetable_detail = {
        table: table,
        customer: customer,
        reservation_date_from: reservation_date_from,
        reservation_date_to: reservation_date_to,
        code: code
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

function createCustomers(cb) {
    async.series([
            function(callback) {
                customerCreate('Client1', callback);
            },
            function(callback) {
                customerCreate('Client2', callback);
            },
        ],
        // optional callback
        cb
    );
}

function createTables(cb) {
    async.parallel([
            function(callback) {
                tableCreate(1, callback);
            },
            function(callback) {
                tableCreate(2, callback);
            },
            function(callback) {
                tableCreate(3, callback);
            },
            function(callback) {
                tableCreate(4, callback);
            }
        ],
        // optional callback
        cb);
}

function createTimeTables(cb) {
    async.parallel([
            function(callback) {
                timetableCreate(tables[0], customers[0], '2021-12-10T16:00:00', '2021-12-10T20:00:00', callback)
            },
        ],
        // optional callback
        cb);
}

async.series([
    //createCustomers,
    createTables,
    //createTimeTables
], function cb(err, results) {
    if (err) {
        console.log('FINAL ERR: ' + err);
    } else {
        console.log('It works!');
    }
    // All done, disconnect from database
    mongoose.connection.close();
});