#! /usr/bin/env node
 // Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
return
}
*/
var async = require('async')
var Waiter = require('./models/waiter')
    //var Table = require('./models/table')
    //var TimeTable = require('./models/time_table')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var waiters = []

function waiterCreate(first_name, last_name, date_of_birth, cb) {
    waiterdetail = { first_name: first_name, last_name: last_name }
    if (date_of_birth != false) waiterdetail.date_of_birth = date_of_birth;
    if (date_of_birth != false) waiterdetail.date_of_death = date_of_birth;

    var waiter = new Waiter(waiterdetail);

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


async.series([
    createWaiters
], function(err, results) {
    if (err) {
        console.log('FINAL ERR: ' + err);
    } else {
        console.log('BOOKInstances: ' + results);
    }
    // All done, disconnect from database
    mongoose.connection.close();
});