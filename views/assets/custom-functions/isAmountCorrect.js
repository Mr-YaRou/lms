function isAmountCorrect(elemId) {
    var fileFunctName = "isAmountCorrect.js_isAmountCorrect";
    console.log(`UPDATE_${fileFunctName}: Executing function`);
    var loanAmt = document.getElementById(elemId).value;
    var min_amt = document.getElementById('textMin').value;
    var max_amt = document.getElementById('textMax').value;
    var result = new Boolean (loanAmt >= min_amt && loanAmt <= max_amt);
    console.log(`UPDATE_${fileFunctName}: Succesful execution: ${result}, amount = ${loanAmt}, min_amount = ${min_amt}, max_amount = ${max_amt}`);
    return result;
}