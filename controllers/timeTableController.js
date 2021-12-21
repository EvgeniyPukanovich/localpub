let TimeTable = require('../models/time_table');
let Table = require('../models/table');
let Customer = require('../models/customer');

exports.time_table_list = function(req, res, next) {
    TimeTable.find({})
        .populate('table')
        .populate('customer')
        .exec(async function(err, list) {
            let possible_time_from = await get_possible_time_from(1);
            let possible_time_to = [];
            if (possible_time_from.length > 0)
                possible_time_to = await get_possible_time_to(1, possible_time_from[0]);

            Table.find({})
                .sort({ number: 1 })
                .exec(function(err, list_tables) {
                    if (err) { return next(err); }
                    let lst = list_tables;
                    // console.log(list)
                    // console.log(lst);
                    res.render('time_table', {
                        time_table_list: list,
                        tables: lst,
                        times_from: possible_time_from,
                        times_to: possible_time_to
                    });
                });

            if (err) { return next(err); }
        });
};

exports.time_table_reserve = async function(req, res, next) {
    console.log(req.body);
    let time_from = Number(req.body.time_from);
    let time_to = Number(req.body.time_to);
    let table_number = Number(req.body.table_number);

    if (time_from === time_to || time_to < time_from) {
        res.send("Некорректный ввод");
        return;
    }

    //may be null
    let time_tabs = await get_time_tables_async(table_number);
    let reserved_time = get_reserved_time_array(time_tabs);
    console.log(reserved_time);
    let desiredTime = [];
    console.log(desiredTime);

    for (let i = time_from; i < time_to; i++) {
        desiredTime.push(i);
    }

    let intersection = desiredTime.filter(x => reserved_time.includes(x));

    if (intersection.length == 0) {
        let customer = new Customer({
            name: req.body.client_name,
        })
        customer.save(function(err) {
            if (err) { return next(err); }
            console.log('created customer')
        });
        let from = new Date();
        from.setHours(time_from, 0, 0);

        let to = new Date();
        to.setHours(time_to, 0, 0);

        let table = await get_table_async(table_number);

        let time_table = new TimeTable({
            table: table,
            customer: customer,
            reservation_date_from: from,
            reservation_date_to: to,
        });
        time_table.save(function(err) {
            if (err) {
                return next(err);
            }
        })
        res.render('reservation_result', { message: 'Вы успешно записались на следующее время: c ' + time_from + ':00 до ' + time_to + ':00' })
    } else {
        res.render('reservation_result', { message: 'Что то пошло не так. Попробуйте еще раз' })
    }
}

async function get_time_tables_async(table_number) {
    let time_table;
    const promise = TimeTable.find()
        .populate({
            path: 'table',
            match: {
                number: table_number
            }
        })
        .populate('customer')
        .exec();

    await promise.then(time_tables => {
        let found_time_tables = time_tables.filter(function(time_table) {
            return time_table.table;
        });
        time_table = found_time_tables;
    });
    return time_table;
}

async function get_table_async(table_number) {
    let table;

    const promise = Table.find({ number: table_number }).exec();

    await promise.then(t => table = t[0]);
    return table;
}

function get_reserved_time_obj(time_table_object) {
    let reserved_time = [];

    if (time_table_object == null)
        return reserved_time;

    let start_hour = time_table_object.reservation_date_from.getHours();
    let end_hour = time_table_object.reservation_date_to.getHours();
    if (end_hour == 0)
        end_hour = 24;

    for (let i = start_hour; i < end_hour; i++) {
        reserved_time.push(i);
    }

    return reserved_time;
}

function get_reserved_time_array(time_table_array) {
    let reserved_time = []

    time_table_array.forEach(element => {
        let res_time = get_reserved_time_obj(element);
        reserved_time = reserved_time.concat(res_time);
    });

    return reserved_time;
}

async function get_possible_time_from(table_number) {
    let time_tables = await get_time_tables_async(table_number);
    let reserved_time = get_reserved_time_array(time_tables);

    let possibleTime = [];

    for (let i = 12; i < 24; i++) {
        possibleTime.push(i);
    }

    return possibleTime.filter(x => !reserved_time.includes(x));
}

async function get_possible_time_to(table_number, time_from) {
    //console.log(table_number);
    //console.log(time_from);
    let time_tables = await get_time_tables_async(table_number);
    let reserved_time = get_reserved_time_array(time_tables);
    console.log(reserved_time)
    time_from = Number(time_from);
    let time_to = [];

    for (let i = time_from + 1; i <= 24; i++) {
        time_to.push(i);
        if (reserved_time.includes(i))
            break;
    }
    console.log(time_to);
    return time_to;
}

exports.get_time_from = async function(req, res) {
    let table_number = req.body.index;

    let difference = await get_possible_time_from(table_number);

    let arr_json = JSON.stringify(difference);
    res.send(arr_json);
}

exports.get_time_to = async function(req, res) {
    let table_number = req.body.table_number;
    let time_from = req.body.time_from;

    let time_to = await get_possible_time_to(table_number, time_from);
    let arr_json = JSON.stringify(time_to);
    res.send(arr_json);
}