function checkAmount(amtId, submitId) {
    var fileFunctName = "checkAmount.js_checkAmount";
    console.log(`UPDATE_${fileFunctName}: Executing function`);
    if (isAmountCorrect(amtId)) {
        enableSubmit(submitId);
        removeValidation(amtId);
    }
    else {
        const min_amt = document.getElementById('textMin').value;
        const max_amt = document.getElementById('textMax').value;
        changeClass(amtId);
        updateValidationMessage(amtId, `Please input a value between ${min_amt} and ${max_amt}`);
        document.getElementById(submitId).disabled = true;
    }
    console.log(`UPDATE_${fileFunctName}: Succesful execution`);
}

function enableSubmit(elemId) {
    var fileFunctName = "checkAmount.js_enableSubmit";
    console.log(`UPDATE_${fileFunctName}: Executing function`);
    document.getElementById(elemId).disabled = false;
    console.log(`UPDATE_${fileFunctName}: Succesful execution`);
}

