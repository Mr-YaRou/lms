function removeValidation(elemId) {
    var fileFunctName = "removeValidation.js_removeValidation";
    console.log(`UPDATE_${fileFunctName}: Executing function`);
    document.getElementById(elemId).classList.remove('is-invalid');
    console.log(`UPDATE_${fileFunctName}: Succesful execution`);
}