-- View table of loan, customer, loan_type, staff and department

CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `loan_view` AS
    SELECT 
        `l`.`loan_id` AS `loan_id`,
        `l`.`loan_type_id` AS `loan_type_id`,
        `lt`.`name` AS `loanType_name`,
        `lt`.`department_id` AS `loanType_departmentID`,
        `d`.`name` AS `loanType_department`,
        `l`.`status` AS `status`,
        `l`.`account_id` AS `customer_id`,
        `c`.`first_name` AS `customer_firstName`,
        `c`.`last_name` AS `customer_lastName`,
        `c`.`email` AS `customer_email`,
        `c`.`address` AS `customer_address`,
        `c`.`postal_code` AS `customer_postalCode`,
        `c`.`handphone` AS `customer_handphone`,
        `c`.`date_of_birth` AS `customer_DOB`,
        `c`.`company` AS `customer_company`,
        `c`.`job_title` AS `customer_jobTitle`,
        `c`.`annual_salary` AS `customer_salary`,
        `l`.`approver_id` AS `approver_id`,
        `s`.`first_name` AS `staff_firstName`,
        `s`.`last_name` AS `staff_lastName`,
        `s`.`email` AS `staff_email`,
        `s`.`position` AS `staff_position`,
        `s`.`department_id` AS `staff_departmentID`,
        `l`.`remarks` AS `remarks`,
        `l`.`start_date` AS `start_date`,
        `l`.`end_date` AS `end_date`,
        `l`.`loan_amount` AS `loan_amount`,
        `l`.`date_of_application` AS `date_of_application`,
        `l`.`approved_on_date` AS `approved_on_date`,
        `l`.`outstanding_amount` AS `outstanding_amount`
    FROM
        ((((`loan` `l`
        JOIN `customer` `c`)
        JOIN `loan_type` `lt`)
        JOIN `staff` `s`)
        JOIN `department` `d`)
    WHERE
        ((`l`.`loan_type_id` = `lt`.`loan_type_id`)
            AND (`c`.`cus_id` = `l`.`account_id`)
            AND (`l`.`approver_id` = `s`.`staff_id`)
            AND (`d`.`department_id` = `lt`.`department_id`)
            AND (`l`.`status` = 'approved'))





-- auto increase customer id insert
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_customer_All`(
	firstName VARCHAR(256),
    lastName VARCHAR(256),
    email VARCHAR(256),
    address VARCHAR(256), 
    postalCode CHAR(6), 
    handphone CHAR(8), 
    dateOfBirth DATE, 
    company VARCHAR(256), 
    jobTitle VARCHAR(256), 
    annual_salary DOUBLE, 
    userName VARCHAR(256), 
    pass_word VARCHAR(256)

)
BEGIN
	set @last_id = (

		SELECT cus_id FROM lms.customer ORDER BY cus_id DESC LIMIT 1

		) + 1;
	INSERT INTO customer VALUES (@last_id, firstName, lastName, email, address, postalCode, handphone, dateOfBirth, company, jobTitle, annual_salary, userName, pass_word);
	
END




-- auto increase loan id insert

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_loan_ALL`(
	loanTypeID INT(8), 
	account_id INT(8), 
    loanAmount DOUBLE, 
    outstandingAmount DOUBLE, 
    startDate DATE, 
    endDate DATE, 
    loanstatus VARCHAR(45), 
    approver_id INT(8), 
    remarks VARCHAR(256), 
	dateOfApplication DATE, 
	approvedOnDate DATE
    
)
BEGIN
	
    set @last_id = (

		SELECT loan_id FROM loan ORDER BY loan_id DESC LIMIT 1

		) + 1;
	
    INSERT INTO loan VALUES (@last_id, loanTypeID, loanstatus, accountId, approverId, remarks, endDate, loanAmount, dateOfApplication, approvedOnDate, outstandingAmount, startDate);
        
    
    
END




-- auto increase payment id insert

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_payment_ALL`(
	transaction_id INT(8), 
    loan_id INT(8), 
    payment_amount DOUBLE, 
    interest_rate DOUBLE, 
    principal_amount DOUBLE, 
    start_date DATE, 
    end_date DATE, 
    payment_frequency INT(11)

)
BEGIN
	set @last_id = (

		SELECT payment_id FROM payment ORDER BY payment_id DESC LIMIT 1

		) + 1;
	
    INSERT INTO customer VALUES (@last_id, transaction_id, loan_id, payment_amount, interest_rate, principal_amount, start_date, end_date, payment_frequency);
        
END





-- auto increase staff id insert
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_staff_ALL`(
	first_name VARCHAR(256), 
    last_name VARCHAR(256), 
    email VARCHAR(256), 
    position VARCHAR(256), 
    department_id INT(8), 
    username VARCHAR(256), 
    pass_word VARCHAR(256)
)
BEGIN
	set @last_id = (

		SELECT staff_id FROM staff ORDER BY staff_id DESC LIMIT 1

		) + 1;
        
	INSERT INTO staff VALUES (@last_id, first_name, last_name, email, position, department_id, username, pass_word);
    
END





-- approve update on clicking
CREATE DEFINER=`root`@`localhost` PROCEDURE `approval_update`(
ID INT(8),
approveID INT(8)

)
BEGIN
	
	set @duration = (SELECT lt.duration from loan_type lt, loan l where l.loan_type_id = lt.loan_type_id AND l.loan_id = ID limit 1);
    set @loanAmount = (SELECT loan_amount from loan where loan_id = ID LIMIT 1);
    UPDATE loan SET outstanding_amount = @loanAmount, start_date = current_date()+1, approved_on_date = current_date(), `status` = "approved", end_date = current_date() + INTERVAL @duration YEAR, approver_id = approveID WHERE loan_id = ID ; 
    
END