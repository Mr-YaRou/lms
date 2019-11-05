function updateElements(activityId, elemIdList, loanTypeStr, elemLoanTypeMap) {
    //var activityId = elem.value;
    var fileFunctName = "updateElements.js_updateElements";
    console.log(`UPDATE_${fileFunctName}: Executing function`);
    console.log(`\n${loanTypeStr}\n`);
    var loanTypeJSON = JSON.parse(loanTypeStr);
    //console.log(`\n${loanTypeJSON}\n`);

    var index = getLoanDetails(activityId,loanTypeJSON);
    if (index >= 0) {
        for (i = 0; i < Object.keys(elemIdList).length; ++i) {
            const loanTypeAttr = elemLoanTypeMap.get(elemIdList[i]);
            var loanTypeVal= loanTypeJSON[index][loanTypeAttr];
            if (loanTypeAttr != undefined) {
                document.getElementById(elemIdList[i]).value = loanTypeVal;
            }
            else {
                console.log(`ERROR_${fileFunctName}: Unable to map element to a loan type attribute`);
            }
        }
    }
    else {
        console.log(`ERROR_${fileFunctName}: <Loan Type> not found`);
    }
    console.log(`UPDATE_${fileFunctName}: Succesful execution`);
}

function getLoanDetails(activityId, loanTypeJSON) {
    var fileFunctName = "updateElements.js_getLoanDetails";
    console.log(`UPDATE_${fileFunctName}: Executing function`);

    var i;
    for (i = 0; i < Object.keys(loanTypeJSON).length; ++i) {
        //console.log(loanTypeJSON[i].loan_type_id);
        //console.log(activityId);
        if(loanTypeJSON[i].loan_type_id == activityId) {
            console.log(`UPDATE_${fileFunctName}: Successful execution`)
            return i;
        }
    };

    console.log(`ERROR_${fileFunctName}: <Loan Type> not found`);
    return -1;
};

