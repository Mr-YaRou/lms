function isAmountCorrect(elemId) {
    var fileFunctName = "isAmountCorrect.js_isAmountCorrect";
    console.log(`UPDATE_${fileFunctName}: Executing function`);
    const loanAmt = document.getElementById(elemId).value;
    const min_amt = document.getElementById('textMin').value;
    const max_amt = document.getElementById('textMax').value;
    console.log(`UPDATE_${fileFunctName}: Succesful execution`);
    return loanAmt >= min_amt && loanAmt <= max_amt;
}