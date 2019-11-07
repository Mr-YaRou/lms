function addValidation(elemId) {
    const fileFunctName = "addValidation.js_addValidation";
    console.log(`UPDATE_${fileFunctName}: Executing function`);
    changeClass(elemId);
    const loanTypeVal = new String(document.getElementById('selectLoan').value);

    if (loanTypeVal.length > 0 && !(isAmountCorrect(elemId))) {
       const min_amt = document.getElementById('textMin').value;
       const max_amt = document.getElementById('textMax').value;
       updateValidationMessage(elemId, `Please input a value between ${min_amt} and ${max_amt}`)
    }
    else {
        removeValidation(elemId);
    }
    console.log(`UPDATE_${fileFunctName}: Succesful execution`);
}
