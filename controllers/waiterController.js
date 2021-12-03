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


// Display list of all Waiters.
exports.waiter_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Waiter list');
};

// Display detail page for a specific Waiter.
exports.waiter_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Waiter detail: ' + req.params.id);
};

// Display Waiter create form on GET.
exports.waiter_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Waiter create GET');
};

// Handle Waiter create on POST.
exports.waiter_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Waiter create POST');
};

// Display Waiter delete form on GET.
exports.waiter_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Waiter delete GET');
};

// Handle Waiter delete on POST.
exports.waiter_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Waiter delete POST');
};

// Display Waiter update form on GET.
exports.waiter_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Waiter update GET');
};

// Handle Waiter update on POST.
exports.waiter_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Waiter update POST');
};