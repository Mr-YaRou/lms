const fs = require('fs');
const express = require('express');

const Router = express.Router();
const {
    promisify,
  } = require('util');
  

const mydatabase = require('./database');


const queryAsync = promisify(mydatabase.query).bind(mydatabase);

Router.get('/', async (req, res) => {
    
    if (req.session.loggedin && req.session.staff) {
        //response.send('Welcome back, ' + request.session.username + '!');


        let staff_profile = 'select s.first_name, s.last_name, s.position, d.name from staff s, department d where s.department_id = d.department_id AND s.staff_id = ?;';
        let access_SQL = 'select acty.name from access_type acty where exists (select * from access ac where ac.accesstype_id = acty.access_id AND ac.account_id = ?); '; 
       
        let approveLoan = {};

        accessRes = await queryAsync(access_SQL,[req.session.sta_id]);
        let staffRes = await queryAsync(staff_profile,[req.session.sta_id]);
        
        let approveLoanSQL = 'select l.loan_id, lt.name, l.loan_amount, c.first_name from loan l, loan_type lt, customer c where l.account_id = c.cus_id AND l.status = "new" AND lt.loan_type_id = l.loan_type_id AND exists (select acty.department_id from access_type acty where lt.department_id = acty.department_id AND acty.approval_limit >= l.loan_amount AND exists (select * from access ac where ac.accesstype_id = acty.access_id AND ac.account_id = ? )); ';
        //let LOL = staffRes[0].first_name;
        approveLoan = await queryAsync(approveLoanSQL,[req.session.sta_id]);

        
        
        
        
       //console.log(approveLoan);
       

        res.render('staff', {
            staffID: req.session.sta_id,
            staffRes: staffRes[0],
            accessRes: accessRes,
            approveLoan: approveLoan
            
        });
   
    } else {
       // res.send('Please login to view this page!');
    }
    //res.end();

});


Router.post('/update/:id', (req,res) => {
    let loan_ID = req.params.id;
    

    let updateApproveSQL = 'update loan set status = "approved", approver_id = ? where loan_id = ?;';
    mydatabase.query(updateApproveSQL,[req.session.sta_id, loan_ID],(err, result)=>{
        if (err) {
            return res.status(500).send(err);
        }
        res.redirect('/');
    })

})

/*


Router.post('/', (req, res) => {
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

});*/


module.exports = Router;