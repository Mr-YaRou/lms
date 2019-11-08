CREATE DEFINER=`root`@`localhost` PROCEDURE `Insert_Customers`(
username varchar(256),
password varchar(256),
email varchar(256)
)
BEGIN
	set @last_id = (
		SELECT cus_id FROM lms.customer ORDER BY cus_id DESC LIMIT 1
		) + 1;
	INSERT INTO `lms`.`customer`
	(`cus_id`,
	`username`,
	`password`,
    `email`)
	VALUES
	(
	@last_id,
	username,
	password,
    email
	);

	SELECT cus_id,username,password FROM lms.customer ORDER BY cus_id DESC LIMIT 1;
END


CREATE DEFINER=`root`@`localhost` PROCEDURE `Update_Customer_Details`(
ID INT(8),
first_name VARCHAR(256),
last_name VARCHAR(256),
address VARCHAR(256),
postal CHAR(6),
handphone CHAR(8),
dob DATE,
company VARCHAR(256),
salary DOUBLE,
jobtitle VARCHAR(256)
)
BEGIN
	UPDATE `lms`.`customer`
		SET
		`first_name` =  first_name,
		`last_name` = last_name,
		`address` = address,
		`postal_code` = postal,
		`handphone` = handphone,
		`date_of_birth` = dob,
		`company` = company,
		`job_title` = jobtitle,
		`annual_salary` = salary
	WHERE `cus_id` = ID;
END


CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `lms`.`customer_notpaid_loans` AS
    SELECT 
        `lms`.`loan`.`loan_id` AS `loan_id`,
        `lms`.`loan`.`account_id` AS `account_id`,
        `lms`.`loan_type`.`name` AS `name`,
        `lms`.`loan_type`.`duration` AS `duration`,
        `lms`.`loan_type`.`interest` AS `interest`,
        `lms`.`loan`.`loan_amount` AS `loan_amount`,
        0 AS `Total Paid`,
        `lms`.`loan`.`status` AS `status`
    FROM
        ((`lms`.`loan`
        JOIN `lms`.`loan_type`)
        JOIN `lms`.`payment`)
    WHERE
        (NOT (`lms`.`loan`.`loan_id` IN (SELECT 
                `customer_paid_loans`.`loan_id`
            FROM
                `lms`.`customer_paid_loans`)))
    GROUP BY `lms`.`loan`.`loan_id`


	CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `lms`.`customer_paid_loans` AS
    SELECT 
        `lms`.`loan`.`loan_id` AS `loan_id`,
        `lms`.`loan`.`account_id` AS `account_id`,
        `lms`.`loan_type`.`name` AS `name`,
        `lms`.`loan_type`.`duration` AS `duration`,
        `lms`.`loan_type`.`interest` AS `interest`,
        `lms`.`loan`.`loan_amount` AS `loan_amount`,
        SUM(`lms`.`payment`.`payment_amount`) AS `Total Paid`,
        `lms`.`loan`.`status` AS `status`
    FROM
        ((`lms`.`loan`
        JOIN `lms`.`loan_type`)
        JOIN `lms`.`payment`)
    WHERE
        ((`lms`.`loan`.`loan_type_id` = `lms`.`loan_type`.`loan_type_id`)
            AND (`lms`.`loan`.`loan_id` = `lms`.`payment`.`loan_id`))
    GROUP BY `lms`.`loan`.`loan_id`

/* Loan Application */
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_loan`(
   loanTypeId int(8),
   accountId int(8),
   loanAmount double,
   dateToday date
)
BEGIN
    SET @last_id = (
        SELECT loan_id
       FROM lms.loan
       ORDER BY loan_id DESC
       LIMIT 1
    ) + 1;
 
   SET @department_id = (
       SELECT department_id
       FROM lms.loan_type
       WHERE loan_type_id = loanTypeId
   );
 
   SET @approver_id = (
       SELECT staff.staff_id
       FROM lms.staff staff
           LEFT OUTER JOIN lms.loan AS loan ON loan.approver_id = staff.staff_id
       WHERE staff.staff_id IN (
           SELECT access.account_id
           FROM lms.access access
           WHERE access.accesstype_id IN (
               SELECT accessType.access_id
               FROM lms.access_type accessType
               WHERE accessType.department_id = @department_id AND accessType.approval_limit >= loanAmount
           )
       )
       GROUP BY staff.staff_id
       ORDER BY COUNT(loan.approver_id) ASC
       LIMIT 1
   );
 
    INSERT INTO `lms`.`loan`(
       `loan_id`,
       `loan_type_id`,
       `account_id`,
       `loan_amount`,
       `status`,
       `approver_id`,
       `date_of_application`
   )
    VALUES (
       @last_id,
       loanTypeId,
       accountId,
       loanAmount,
       "new",
       @approver_id,
       dateToday
    );
END

