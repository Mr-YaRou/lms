function populateTable(tableId, loanStr) {
    const fileFunctName = "addValidation.js_addValidation";
    console.log(`UPDATE_${fileFunctName}: Executing function`);
    const loanJSON = JSON.parse(loanStr);
    console.log(loanJSON[0]);
    console.log(loanJSON[0]['loan_id']);
    var tableContent = "";
    var loanJSONAttr = ['loan_id', 'name', 'status', 'outstanding_amount', 'total_paid', 'interest'];
    for (var i = 0; i < Object.keys(loanJSON).length; ++i) {
        tableContent += '<tr>';
        for (var j = 0; j < Object.keys(loanJSONAttr).length; ++j) {
            console.log(loanJSONAttr[j]);
            const attr = loanJSONAttr[j];
            console.log(loanJSON[i][attr]);
            tableContent += '<td>' + loanJSON[i][attr] + '<\\td>';
        }
        tableContent += '</tr>'
    };
    console.log(tableContent);
    document.getElementById("tableLoansOverview tbody").html(tableContent);

    /*
    <tr>
        <td>Garrett Winters</td>
        <td>Accountant</td>
        <td>Tokyo</td>
        <td>63</td>
        <td>2011/07/25</td>
        <td>$170,750</td>
    </tr>
    */

}