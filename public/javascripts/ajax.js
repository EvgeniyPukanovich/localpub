window.onload = function() {
    document.getElementById('table_number').addEventListener('change', (event) => { get_time_from(event.target.value) })
    document.getElementById('time_from').addEventListener('change', (event) => { get_time_to(event.target.value) })
};

let selected_table = 1;

function get_time_from(table_number) {
    selected_table = table_number;
    let index = {
        index: table_number,
    }
    fetch('time_table/get_time_from', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Content-Security-Policy': 'default-src http:; script-src http:\'unsafe-inline\''
            },
            body: JSON.stringify(index)
        })
        .then(response => response.json())
        .then(response => {
            if (response.length > 0) {
                insert_options(response, 'time_from')
                console.log(response[0]);
                get_time_to(response[0]);
            } else {
                insert_options(response, 'time_from')
                insert_options(response, 'time_to')
            }
        });
}

function get_time_to(time_from) {
    let obj = {
        table_number: selected_table,
        time_from: time_from
    }

    fetch('time_table/get_time_to', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Content-Security-Policy': 'default-src http:; script-src http:\'unsafe-inline\''
            },
            body: JSON.stringify(obj)
        })
        .then(response => response.json())
        .then(response => insert_options(response, 'time_to'));
}

function insert_options(options, dest_elem_id) {
    let select = document.getElementById(dest_elem_id);
    let child = select.lastElementChild;
    if (child != null) {
        while (child) {
            select.removeChild(child);
            child = select.lastElementChild;
        }
    }

    for (let i = 0; i < options.length; i++) {
        let opt = document.createElement('option');
        opt.value = options[i];
        opt.innerHTML = options[i];
        select.appendChild(opt);
    }
}