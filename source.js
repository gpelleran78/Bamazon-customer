const mysql = require(`mysql`);
const inquirer = require(`inquirer`);

const connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "QAZwsx1234",
    database: "bamazon_db",
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connection successful");
    makeTable();
});

let makeTable = function () {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " || " + res[i].product_name + " || " +
                res[i].department_name + " || " + res[i].price + " || " + res[i].
                    stock_quanity + "\n");
        };
        promtCustomer(res);
    });
};

let promtCustomer = function (res) {
    inquirer.prompt([{
        type: `input`,
        name: `choice`,
        message: "What would you like to purchase? [Quit with Q]"
    }]).then(function (answer) {
             correct = false;
        for (var i = 0; i < res.length; i++) {
            if (res[i].product_name == answer.choice) {
                correct = true;
                var product = answer.choice;
                var id = i;
                inquirer.prompt({
                    type: "input",
                    name: `quant`,
                    message: "How many would you like to buy?",
                    validate: function (value) {
                        if (isNaN(value) == false) {
                            return true;
                        } else {
                            return false;
                        };
                    }
                }).then(function (answer) {
                    if ((res[id].stock_quanity - answer.quant) > 0) {
                        connection.query("UPDATE products SET stock_quanity='" + (res[id].stock_quanity -
                            answer.quant) + "' WHERE product_name = '" + product + "'", function (err, res2) {
                                console.log("Product Bought!!!");
                                makeTable();
                            });
                    } else {
                        console.log("Not a valid Selection!!!");
                        promptCustomer(res);
                    };
                });
            };
        };
    });
};