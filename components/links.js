var LINKS = function (str, data, email) {
  var    STYLE = data.style || '',
         GRADE = data.grade || '';

  var dl = `<dl class="${STYLE} ${GRADE} links">`,
      dt = `<dt>`,
      dd = '',
      tc = '';

  var heading = data.data[0];

  if (email) {
    // need extra markup
    dl = `<table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><dl class="${STYLE} ${GRADE} links">`;
  }

  dt += `<strong><span class="def-title">${heading.text}</span></strong>`;
  dt += '</dt>';

  for (var k=1; k<data.data.length; k++) {
    var item = data.data[k];
    dd += '<dd>';
    dd += `<span class="${item.grade || ''}"><span class="def-content"><a href="${item.link}">${item.text}</a></span></span>`;
    dd += '</dd>';
  }
  dd += '</dl>';
  return dl + dt + dd + tc;
}

module.exports = LINKS;