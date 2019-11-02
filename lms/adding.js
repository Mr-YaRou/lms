const fs = require('fs');
const express = require('express');

const Router = express.Router();

const mydatabase = require('./database');



Router.get('/addcustomer', (req, res) => {
    res.render('addCustomer', {})
});
Router.post('/addcustomer', (req, res) => {
    let cusID = req.body.cusID;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let address = req.body.address;
    let postal_code = req.body.postal_code;
    let handphone = req.body.handphone;
    let date_of_birth = req.body.DOB;
    let job_title = req.body.job_title;
    let company = req.body.company;
    let annualSalary = req.body.salary;
    let userName = req.body.userName;
    let password = req.body.password;

    let query = "Insert INTO customer values ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

    mydatabase.query(query, [cusID,first_name,last_name,email,address,postal_code,handphone,date_of_birth,job_title,company,annualSalary, userName, password] , (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.redirect('/');
    })

});



module.exports = Router;
/*{

    addCustomerPage: (req, res) => {
        res.render('addCustomer', {})
    },
    addCustomer: (req, res) => {
        let cusID = req.body.cusID;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let email = req.body.email;
        let address = req.body.address;
        let postal_code = req.body.postal_code;
        let handphone = req.body.handphone;
        let date_of_birth = req.body.DOB;
        let job_title = req.body.job_title;
        let company = req.body.company;
        let annualSalary = req.body.salary;
        let userName = req.body.userName;
        let password = req.body.password;

        let query = "Insert INTO customer values ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

        mydatabase.query(query, [cusID,first_name,last_name,email,address,postal_code,handphone,date_of_birth,job_title,company,annualSalary, userName, password] , (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        })

    },
    addStaffPage: (req, res) => {
        res.render('addStaff', {})
    },
    addStaff: (req,res) => {
        let staID = req.body.userID;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let email = req.body.email; 
        let position = req.body.position;
        let departmentID = req.body.departmentID;
        let userName = req.body.userName;
        let password = req.body.password;

        let query = "Insert INTO staff values (?, ?, ?, ?, ?, ?, ?, ?);";

        mydatabase.query(query, [staID, first_name, last_name, email, position, departmentID, userName, password], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        })
    },
    addDepartmentPage: (req, res) => {
        res.render('addDepartment', {})
    },
    addDeparment: (req,res) => {
        let departmentID = req.body.departmentID;
        let name = req.body.name;

        let query = "Insert into department values (?, ?);";
        mydatabase.query(query, [departmentID, name], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        })
    },
    addDepartmentPage: (req, res) => {
        res.render('addDepartment', {})
    },
    addLoanRequest: (req,res) => {
        let requestID = req.body.requestID;
        let status = req.body.status;
        let remark = req.body.remark;
        let approverID = req.body.approverID;
        let accountID = req.body.accountID;
        let loanID = req.body.loanID;
        let loanTypeID = req.body.loanTypeID;
        let loanAmount = req.body.loanAmount;

        let query = "Insert into request (requestID, status, remark, approverID, accountID, loanID, loanTypeID, loanAmount) values (?, ?, ?, ?, ?, ?, ?, ?);"
    
        mydatabase.query(query, [requestID, status,remark, approverID, accountID, loanID, loanTypeID, loanAmount], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        })
        
    },
    addLoanPage: (req, res) => {
        res.render('addLoan', {})
    },
    addLoan: (req,res) => {
        let loanID = req.body.loanID;
        let loanTypeID = req.body.loanTypeID;
        let accountID = req.body.accountID;
        let loanAmount = req.body.loanAmount;
        let outstandingAmount = req.body.outstandingAmount;
        let startDate = req.body.startDate;
        let dueData = req.body.dueData;
        
        let query = "Insert into loan values (?, ?, ?, ?, ?, ?, ?);";
        
        mydatabase.query(query, [loanID, loanTypeID, accountID, loanAmount, outstandingAmount, startDate, dueData], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        })
    },
    addPaymentPage: (req, res) => {
        res.render('addPayment', {})
    },
    addPayment: (req,res) => {
        let paymentID = req.body.paymentID;
        let transactionID = req.body.transactionID;
        let loanID = req.body.loanID;
        let amount = req.body.amount;
        let date = req.body.date;
        
        let query = "Insert into payment values ( ?, ?, ?, ?, ?);";
        
        mydatabase.query(query, [paymentID, transactionID, loanID, amount, date], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        })
    },
    addTransactionTypePage: (req, res) => {
        res.render('TransactionType', {})
    },
    addTransactionType: (req,res) => {
        let transactionID = req.body.transactionID;
        let transactionName = req.body.transactionName;
        
        let query = "Insert into transaction_type values ('transactionID','transactionName');";
        
        mydatabase.query(query, [transactionID, transactionName], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        })
    },
    addAcessTypePage: (req, res) => {
        res.render('addAccessType', {})
    },
    addAccessType: (req,res) => {
        let accessTypeID = req.body.accessTypeID;
        let name = req.body.name;
        let approvalLimit = req.body.approvalLimit;
        let departmentID = req.body.departmentID;
        
        
        let query = "Insert into access_type values (?, ?, ?, ?);";
        
        mydatabase.query(query, [accessTypeID, name, approvalLimit, departmentID], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        })
    },
    addAccessPage: (req, res) => {
        res.render('addAccess', {})
    },
    addAccess: (req,res) => {
        let accountID = req.body.accountID;
        let accessTypeID = req.body.accessTypeID;
        
        let query = "Insert into access values ( ?, ?);";
        
        mydatabase.query(query, [accountID, accessTypeID], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        })
    }

}*/