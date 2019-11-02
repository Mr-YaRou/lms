const fs = require('fs');
const mydatabase = require('./database');

module.exports = {
    adminPage: (req, res) => {
        res.render('admin', {})
    },
    viewTable: (req, res) => {
        let table = req.query.table;
        var SQL;
        switch(table){
            case "customer":
                SQL = 'SELECT * FROM customer';
                break;
            case "staff":
                    SQL = 'SELECT * FROM staff';
                    break;
            case "department":
                    SQL = 'SELECT * FROM department';
                    break;
            case "loan":
                    SQL = 'SELECT * FROM loan';
                    break;    
            case "loan_type":
                    SQL = 'SELECT * FROM loan_type';
                    break; 
            case "request":
                    SQL = 'SELECT * FROM request';
                    break;
            case "payment":
                    SQL = 'SELECT * FROM payment';
                    break;
            case "transaction_type":
                    SQL = 'SELECT * FROM transaction_type';
                    break;
            case "access":
                    SQL = 'SELECT * FROM access';
                    break;
            case "access_type":
                    SQL = 'SELECT * FROM access_type';
                    break;
            default:
                break;
                    
        }
        
        mydatabase.query(SQL, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            console.log(result);
            res.render('view', {
                table:table,
                sql: SQL,
                tableSQL: result
                });
        })
            
    },
    editTable: (req, res) => {
        let table = req.query.table;
        let cus_id = req.query.cus_id;
        let first_name = req.body.first_name;
        var SQL = "Update customer set first_name = ? where cus_id = ?;";


        mydatabase.query(SQL, [first_name, cus_id], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            console.log("Updated");
            res.redirect('/admin/view?table=customer');
        })
    },
    editPage: (req, res) => {
        let table = req.query.table;
        let cus_id = req.query.cus_id;
        var SQL = "Select * from customer where cus_id = ?;";


        mydatabase.query(SQL, [cus_id], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            console.log(result);
            res.render('edit', {
                table:table,
                sql: SQL,
                tableSQL: result
                });
        })
    }
}