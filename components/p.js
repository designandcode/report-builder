var P = function (str, data, email) {
  var    STYLE = data.style || '',
         GRADE = data.grade || '';

  var div = `<div class="${STYLE} ${GRADE}">`,
      //dt = `<dt>`,
      dd = '',
      tc = '',
      p  = '',
      el = '<p>',
      eel = '</p>';

  var heading = data.data[0];

  if (email) {
    // need extra markup
    div = `<table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><div class="${STYLE} ${GRADE}">`;
    tc = '</td></tr></tbody></table>';
    //el = '<div>';
    //eel = '</div>';
  }

  //dt += `<strong>${heading.label}:</strong> <span class="def-title">${heading.text}</span>`;
  //dt += '</dt>';

  for (var k=0; k<data.data.length; k++) {
    var item = data.data[k];
    p += el;
    p += `<span class="${item.grade || ''}"><span class="def-content">${item.text}</span></span>`;
    p += eel;
  }
  p += '</div>';
  return div + p + tc;
  //return str;
}

module.exports = P;
