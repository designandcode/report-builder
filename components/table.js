var TABLE = function (str, data, email) {

  var table = '<table border="0" cellspacing="0" cellpadding="0" class="inner">',
      head = '<thead>',
      body = '<tbody>';

  //console.log(table, head, body);

  //head = '<thead>';
  data.data[0].forEach(x => head += `<th>${x}</th>`);
  head += '</thead>';

  for (var k=1; k<data.data.length; k++) {
    var row = data.data[k];
    body += '<tr>';
    row.forEach(x => body += `<td>${x}</td>`);
    body += '</tr>';
  }
  body += '</tbody></table>';
  return table + head + body;
}

module.exports = TABLE;