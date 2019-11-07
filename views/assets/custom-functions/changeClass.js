function changeClass(elemId) {
    const fileFunctName = "changeClass.js_changeClass";
    console.log(`UPDATE_${fileFunctName}: Executing function`);
    document.getElementById(elemId).classList.add('is-invalid');
    console.log(`UPDATE_${fileFunctName}: Succesful execution`);
}