/**
 *  Contains all of the routes used by the application
 */
const express = require('express')


const router = express.Router();

const database = require('../DataBase Project/database');

const {
    promisify,
} = require('util');

const queryAsync = promisify(database.query).bind(database);

/**
 *  SQL Queries Used - ttry to refactor into a json file
 */
var Login_Validate = 'SELECT * FROM lms.customer WHERE username = ? AND password = ?';
var customer_sign_up = 'CALL lms.Insert_Customers(?,?,?)';
var session_token = 'SELECT cus_id from lms.customer WHERE username = ?';
var customer_update = 'CALL lms.Update_Customer_Details(?,?,?,?,?,?,?,?,?,?)';
var customer_details = 'SELECT * FROM lms.customer where cus_id = ? ;';

var customer_retrieve_loan = 'call lms.loan_extract(?)';

//TODO - create proper home page 
router.get('/', (request, response) => {
    response.render('homepage');
});

router.get('/register', (request, response) => {
    response.render('register');
});

router.get('/register/again', (request, response) => {
    response.send("Username is already taken. Please go back and register");
});

// User Sign Up
router.post('/reg', async function (request, response) {
    var email = request.body.email;
    var username = request.body.username;
    var password = request.body.password;

    if (email && password && username) {
        database.query(customer_sign_up, [username, password, email], function (_error, results, fields) {

            if (_error) {
                response.redirect('/register/again');
            } else {

                request.session.loggedin = true;
                request.session.username = username;

                console.log('New Account Added to Database');
                console.log('User : %s', username);

                var token;
                database.query(session_token, username, function (_error, results, fields) {
                    if (results.length > 0) {
                        token = results[0].cus_id;
                        console.log(token);
                        request.session.token = token
                        response.redirect('/profile/edit');
                        response.end();
                    }
                });
            }
        });
    } else {
        response.send('Sever got problem, Please Try again');
        response.end();
    }
});

router.get('/profile/edit', (request, response) => {

    if (request.session.loggedin) {
        response.render('editprofile');
    } else {
        response.send('Please login to view this page!');
    }

});

router.get('/login', (req, res) => {
    res.render('login');
});

// User Log in Authentication 
// TODO - Design Seperate Routing Paths for Customer and Staff
router.post('/auth', function (request, response) {
    var username = request.body.username;
    var password = request.body.password;
    var role = request.body.radio;

    var token;
    database.query(session_token, username, function (_error, results, fields) {
        token = results[0].cus_id;
    });
    if (username && password) {
        database.query(Login_Validate, [username, password], function (_error, results, fields) {
            if (results.length > 0) {
                console.log('User %s has Logged in', username);
                request.session.loggedin = true;
                request.session.username = username;
                request.session.token = token;
                response.redirect('/profile');
            } else {
                response.send('Incorrect Username and/or Password!'); // Can be a redictect 
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!'); // Can be a redirect 
        response.end();
    }
});

/**
 *  Successful Log In - Profile Page 
 * 
 * TODO -> Edit Profile page and Profile Dashboard 
 */
router.get('/profile', async function (request, response) {

    if (request.session.loggedin) {
        // Test
        // Test End
        // Contains Account ID Details
        var token = request.session.token;

        try {
            // await query for Customer Details to be sent toProfile page
            let user_data = await queryAsync(customer_details, [token]);
            let loan_data = await queryAsync(customer_retrieve_loan, [token]);

            console.log(loan_data[0]);

            response.render('profile', {
                customer: user_data,
                loans: loan_data
            });
        } catch (error) {
            console.log('SQL error', error);
            response.status(500).send('Something went wrong');
        }
    } else {
        response.send('Please login to view this page!');
    }
});

router.get('/logout', function (req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});

router.post('/profile/update', function (request, response) {

    var cus_id = request.session.token
    var first_name = request.body.first_name;
    var last_name = request.body.last_name;
    var address = request.body.address;
    var postal_code = request.body.postal_code;
    var handphone = request.body.handphone;
    var dob = request.body.date;
    var company = request.body.company;
    var job_title = request.body.job_title;
    var annual_salary = request.body.annual_salary;

    var obj = {
        cus_id,
        first_name,
        last_name,
        address,
        postal_code,
        handphone,
        dob,
        company,
        annual_salary,
        job_title
    };

    if (obj) {
        database.query(customer_update, [cus_id, first_name, last_name, address, postal_code, handphone, dob, company, annual_salary, job_title], function (_error, results, fields) {

            if (_error) {
                console.log(_error);
                response.redirect('/');
                response.end();
            }

            response.redirect('/profile');

        });
    } else {
        response.send('There is a Query Error!'); // Can be a redirect 
        response.end();
    }

});

// TODO -> test page for async programming
router.get('/test', async (request, response) => {
    const selectSQL = 'SELECT * FROM lms.customer where first_name like ?';

    let entries = {};

    try {
        entries = await queryAsync(selectSQL, [request.query.entries]);

        response.render('test', {
            entries: entries,
        });

        console.log(selectSQL);

        console.log(entries);

    } catch (err) {
        console.log('SQL error', err);
        response.status(500).send('Something went wrong');
    }

});

/**
 *  For testing
 * 
 */

// TODO GET LOAN DETAILS
router.get('/loandetails/:id', function (req, res) {

    var loanID = req.params.id;

    console.log('Loan ID sent is : ', loanID);

    res.send('Sucess Send');
})

/**
 *  Default 404 Page - if no Path Found 
 */
router.get('*', (request, response) => {
    response.render('error');
});


module.exports = router;

