
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