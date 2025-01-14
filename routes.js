/**
 *  Contains all of the routes used by the application
 */
const express = require('express')

const router = express.Router();

const database = require('./database');

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
var session_token_staff = 'select staff_id from lms.staff where username = ? and password = ?'
var Login_Validate_staff = 'SELECT * FROM lms.staff WHERE username = ? AND password = ?';
var staff_department_validate = 'select * from lms.access where (select staff_id from lms.staff where staff_id = ?) AND account_id = ?';
var customer_retrieve_loan = 'SELECT loan.loan_id, loanType.name, loan.status, loan.loan_amount, loan.outstanding_amount, SUM(payment.payment_amount) AS total_paid, loanType.interest FROM lms.loan loan LEFT OUTER JOIN lms.payment payment ON payment.loan_id = loan.loan_id INNER JOIN lms.loan_type loanType ON loanType.loan_type_id = loan.loan_type_id WHERE loan.account_id = ? GROUP BY loan.loan_id';

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

// Login Page
router.get('/login', (req, res) => {
    res.render('login');
});

//Loan Application
router.get('/loanapplication', (req, res) => {
    if(req.session.loggedin) {
        const loanTypeQuery = 'SELECT loan_type_id, name, min_amount, max_amount, duration, interest, department_id FROM loan_type'
        database.query(loanTypeQuery, function(_error, results, fields) {
            if(_error) throw _error;
            res.render('loanApplication.ejs', {
                loanTypes: results,
                loanTypesStr: JSON.stringify(results)
            });
        });
    }
    else {
        console.log('Loan Application: User not logged in');
        res.redirect('/login');
    }
});

router.post('/loanapplication/submit', (req, res) => {
    if(req.session.loggedin) {
        const submitLoanQuery = 'CALL lms.insert_loan(?,?,?,?)';
        var loanTypeId = req.body.loanType;
        var accountId = req.session.token;
        var loanAmount = req.body.loanAmount;
        var today = new Date();
        var dateToday = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        database.query(submitLoanQuery, [loanTypeId, accountId, loanAmount, dateToday], function (_error, results, fields) {
            if(_error) {
                console.log('Loan Application: Loan submission failed');
                res.redirect('/loanapplication');
                throw _error;
            }
            console.log([loanTypeId, accountId, loanAmount, dateToday]);
            console.log('Loan Application: Loan submission successful');
            res.redirect('/loanapplication/success');
        });
    }
    else {
        console.log('Loan Application/Submit Loan: User not logged in');
        res.redirect('/login');
    }
});
//

//Successful Loan Submission

router.get('/loanapplication/success', (req, res) => {
    if(req.session.loggedin) {
            res.render('loanSubmission.ejs', {
            });
    }
    else {
        console.log('Loan Application: User not logged in');
        res.redirect('/login');
    }
});

// User Log in Authentication 
router.post('/auth', function (request, response) {
    var username = request.body.username;
    var password = request.body.password;
    var role = request.body.radio;

    var token;

    if (username && password && role == 'CUSTOMER') {
        database.query(Login_Validate, [username, password], function (_error, results, fields) {
            if (results.length > 0) {
                console.log('CUSTOMER ROUTE');
                database.query(session_token, username, function (_error, results, fields) {
                    token = results[0].cus_id;
                    console.log('Customer %s has Logged in', username);
                    request.session.loggedin = true;
                    request.session.username = username;
                    request.session.token = token;
                    console.log(request.session);
                    response.redirect('/profile');
                });
            } else {
                response.send('Incorrect Username and/or Password!'); // Can be a redictect 
            }

        });
    } else if (username && password && role == 'STAFF') {
        database.query(Login_Validate_staff, [username, password], function (_error, results, fields) {
            if (results.length > 0) {

                console.log('STAFF ROUTE');
                database.query(session_token_staff, [username, password], function (_error, results, fields) {
                    token = results[0].staff_id;
                    console.log('Staff %s has Logged in', username);
                    request.session.Staffloggedin = true;
                    request.session.username = username;
                    request.session.token = token;
                    console.log(request.session);
                    response.redirect('/staff');
                });
            }
        })
    } else {
        response.send('Incorrect Username and/or Password!'); // Can be a redictect 
    }
});




/**
 *  Successful Log In - Profile Page 
 * 
 * TODO -> Edit Profile page and Profile Dashboard 
 */
router.get('/profile', async function (request, response) {
    if (request.session.loggedin) {
        var token = request.session.token;

        try {
            // await query for Customer Details to be sent toProfile page
            let user_data = await queryAsync(customer_details, [token]);
            let loan_data = await queryAsync(customer_retrieve_loan, [token]);
            var loanStr = JSON.stringify(loan_data);
            loanStr = loanStr.replace(/&#34;/g, "\"");
            var tableContent = "";
            var loanJSONAttr = ['loan_id', 'name', 'status', 'loan_amount', 'outstanding_amount', 'total_paid', 'interest'];
            //var table = document.getElementById('tableLoansOverview').getElementsByTagName('tbody')[0];
            for (var i = 0; i < Object.keys(loan_data).length; ++i) {
                tableContent += '<tr>';
                for (var j = 0; j < Object.keys(loanJSONAttr).length; ++j) {
                    const attr = loanJSONAttr[j];
                    tableContent += '<td>' + loan_data[i][attr] + '</td>';
                }
                tableContent += '</tr>'
            };
            //console.log(tableContent);
            tableContent = tableContent.replace(/null/g, '0');
            response.render('profile', {
                customer: user_data,
                loanStr: JSON.stringify(loan_data),
                loanHTML: tableContent
            });
        } catch (error) {
            console.log('SQL error', error);
            response.status(500).send('Something went wrong');
        }
    } else {
        console.log('Profile: User not logged in');
        response.redirect('/login');
    }
});

router.get('/logout', function (req, res, next) {
    if (req.session) {
        // delete session object
        console.log("User ? has logged out", req.session.username);
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

})

/**
 *  Default 404 Page - if no Path Found 
 */
router.get('*', (request, response) => {
    response.render('error');
});


module.exports = router;

