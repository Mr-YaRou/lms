Insert into staff values ('staffID', 'first_name', 'last_name', 'email', 'position', 'departmentID');

Insert into account values ('acctID', 'userID', 'username', 'password');

Insert into customer values ('cusID', 'firstName', 'lastName', 'email', 'address', postalCode, handphone, 'dateOfBirth', 'company', 'jobTitle', annualSalary);

Insert into loanType values ('loanTypeID', 'name', 'desc', minAmount, maxAmount, duration, interest, lateInterest, 'departmentID', accessTypeID);

Insert into department values (departmentID, 'name');

Insert into request (requestID, status, remark, approverID, accountID, loanID, loanTypeID, loanAmount) values (requestID, 'status', 'remark', approverID, accountID, loanID, loanTypeID, loanAmount);

Insert into loan values (loanID, loanTypeID, accountID, loanAmount, outstandingAmount, startDate, dueData);

Insert into payment values ('paymentID', 'transactionID', 'loanID', amount, 'date');

Insert into transaction_type values ('transactionID','transactionName');

Insert into access_type values (accessTypeID, 'name', 'approvalLimit', 'departmentID');

Insert into access values ('accountID', 'accessTypeID');
