function updateValidationMessage(elemId, msg) {
    var fileFunctName = "updateValidationMessage.js_updateValidationMessage";
    console.log(`UPDATE_${fileFunctName}: Executing function`);
    document.getElementById(elemId + '_validation').innerHTML = msg;
    console.log(`UPDATE_${fileFunctName}: Succesful execution`);
}