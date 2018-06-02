var fs = require('fs'),
    DL = require('./components/DL.js'),
    LINKS = require('./components/LINKS.js'),
    TABLE = require('./components/TABLE.js'),
    P = require('./components/P.js'),
 juice = require('juice'),
 webshot = require('webshot'),
 htmlPdf = require('html-pdf');


function setData() {
  var myArgs = process.argv.slice(2),
   report = myArgs[0];

  return new Promise((resolve, reject) => {
    try {
      var data = require(`./data/data-${report}.js`),
          obj = {data, folder: report}

      resolve( obj );
    } catch (e) {
      reject(e);
    }
  })
}

function setReport(obj) {

   // create a new tmp folder for this report if doesn't exist,
   // otherwise, empty the existing one by this name

   var {data, folder} = obj;

   return new Promise((resolve, reject) => {
    fs.stat(`./.tmp/${folder}`, function(err, success) {
     if (err) {
       // make the dir
       fs.mkdir(`./.tmp/${folder}`, function(err, success) {
         if (err) {
           reject(err);
         }
           resolve(obj);
       })
     } 
       
     resolve(obj);
    })
   })

}


// html

function buildHTMLReport(obj) {
  
  // get known things from the data
  var {data, folder} = obj,
      titleText = data[0].pageName,
      pageTitle = data[0].pageTitle,
      pageIntro = data[0].pageIntro,
      pageConclusion = data[0].pageConclusion,
      // start building out html page
      str = 
        `<html>
           <head>
             <title>${titleText}</title>
             <style type="text/css">
             <!-- Replace with style -->
             </style>
           </head>
           <body>
             <div class="container">
               <h1>${pageTitle}</h1>
                <section><p>${pageIntro || ''}</p></section>`;

  // start loops
  for (var i=1; i<data.length; i++) {
    var section = data[i],
           name = section.sectionName,
     components = section.components;

    str += name ?
      `<section>
        <h2>${name}</h2>`
    : `<section>`;

    for (var j=0; j<components.length; j++) {
      var TYPE = components[j].type,
         STYLE = components[j].style || '',
         GRADE = components[j].grade || '';

      if (TYPE === 'TABLE') {
        str += TABLE(str, components[j]);
      } else if (TYPE === 'DL') {
        str += DL(str, components[j]);
      } else if (TYPE === 'LINKS') {
        str += LINKS(str, components[j]);
      } else if (TYPE === 'P') {
        str += P(str, components[j]);
      }
    }
    str += '</section>';
  }
  str += `<section><p>${pageConclusion || ''}</p></section>`;
  str += '</div></body></html>';

  return new Promise((resolve, reject) => {
    // Make this a shared module - it is used twice with minor differences (html or email)
    fs.readFile('css/html-style.css', function (err, style) {
      if (err) {
        reject(err);
      } else {
        // readFileSync is gross but I just can't stand see another callback here
        var custom;
        // So i am using a try/catch instead :(
        try {
          custom = fs.readFileSync(`css/custom/${folder}.css`);
        } catch (e) {
          custom = '';
        }

        var inlineStyles = str.replace(/<!-- Replace with style -->/gm, style.toString() + custom.toString());
        fs.stat(`./.tmp/${folder}/html`, function(err) {
          if (err) {
            fs.mkdir(`./.tmp/${folder}/html`, function(err, success) {
              if (err) {
                reject(err);
              }
              fs.writeFile(`./.tmp/${folder}/html/index.html`, inlineStyles, function(err) {
                if (err) {
                  reject(err)
                }
                resolve(obj);
              })
            })
          } else {

            fs.writeFile(`./.tmp/${folder}/html/index.html`, inlineStyles, function(err) {
              if (err) {
                reject(err)
              }
              resolve(obj);
            })
          }
        })
      }
    });
  });
}



// email

function buildEmailReport(obj) {
  // console.log(data);
  // get known things from the data
  var {data, folder} = obj,
      titleText = data[0].pageName,
      pageTitle = data[0].pageTitle,
      pageIntro = data[0].pageIntro,
      pageConclusion = data[0].pageConclusion,
      // start building out email
      str = 
        `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
           <html xmlns="http://www.w3.org/1999/xhtml">
             <head>
               <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
               <!--[if !mso]><!-->
                   <meta http-equiv="X-UA-Compatible" content="IE=edge" />
               <!--<![endif]-->
               <meta name="viewport" content="width=device-width, initial-scale=1.0">
               <title></title>
               <!--[if (gte mso 9)|(IE)]>
               <style type="text/css">
                 table {border-collapse: collapse;}
               </style>
               <![endif]-->
               <style type="text/css">
                <!-- Replace with style -->
               </style>
             </head>
             <body>
             
              <div class="webkit">
              <table border="0" cellspacing="0" cellpadding="0">
                <tbody>
                  <tr><td><h1>${pageTitle}</h1><p>${pageIntro || ''}</p></td></tr>
                </tbody>
              </table>`;

  // start loops
  for (var i=1; i<data.length; i++) {
    var section = data[i],
           name = section.sectionName,
     components = section.components;

    str += name ?
      `<table border="0" cellspacing="0" cellpadding="0">
        <tbody><tr><td><h2>${name}</h2></td></tr></tbody>`
    : `<table border="0" cellspacing="0" cellpadding="0">`;

    for (var j=0; j<components.length; j++) {
      var TYPE = components[j].type,
          STYLE = components[j].style || '',
         GRADE = components[j].grade || '';

      if (TYPE === 'TABLE') {
        str += TABLE(str, components[j]);
      } else if (TYPE === 'DL') {
        str += DL(str, components[j], email=true);
      } else if (TYPE === 'LINKS') {
        str += LINKS(str, components[j], email=true);
      } else if (TYPE === 'P') {
        str += P(str, components[j], email=true);
      }
    }
    str += '</table>';
  }
  
  str+= `<tbody><tr><td><p>${pageConclusion || ''}</p></td></tr></tbody>`;
  str+= '</div></body></html>';

  
  return new Promise((resolve, reject) => {
    // Make this a shared module - it is used twice with minor differences (html or email)
    fs.readFile('css/email-style.css', function (err, style) {
      if (err) {
        console.log(216);
        reject(err);
      } else {
        // readFileSync is gross but I just can't stand see another callback here
        var custom;
        // So i am using a try/catch instead :(
        try {
          custom = fs.readFileSync(`css/custom/${folder}.css`);
        } catch (e) {
          custom = '';
        }

        var inlineStyles = str.replace(/<!-- Replace with style -->/gm, style.toString() + custom.toString());
        fs.stat(`./.tmp/${folder}/email`, function(err) {
          if (err) {
            fs.mkdir(`./.tmp/${folder}/email`, function(err, success) {
              if (err) {
                console.log(233);
                reject(err);
              }
              fs.writeFile(`./.tmp/${folder}/email/index.html`, inlineStyles, function(err) {
                if (err) {
                  console.log(238)
                  reject(err)
                }
                resolve(obj);
              })
            })
          } else {

            fs.writeFile(`./.tmp/${folder}/email/index.html`, inlineStyles, function(err) {
              if (err) {
                console.log(248);
                reject(err)
              }
              resolve(obj);
            })
          }
        })
      }
    });
  });

}

// img

function buildImgReport(obj) {

  /* This function won't work unless an html page is created in a previous step */

  var {data, folder} = obj,
      options = {
        /*screenSize: {
          width: 1020,
          height: 768
        },*/
        shotSize: {
          width: 'window',
          height: 'all'
        },
        siteType: 'html'
      };

  return new Promise((resolve, reject) => {
    
    fs.readFile(`./.tmp/${folder}/html/index.html`, function(err, html) {
      if (err) {
        reject(err);
      }

      fs.stat(`./.tmp/${folder}/img`, function(err) {
        if (err) {
          fs.mkdir(`./.tmp/${folder}/img`, function(err, success) {
            if (err) {
              reject(err);
            }

            webshot(html, `./.tmp/${folder}/img/index.jpg`, options, function(err) {
              if (err) {
                reject(err);
              }

              resolve(obj);
            });
          });
        }

        webshot(html, `./.tmp/${folder}/img/index.jpg`, options, function(err) {
          if (err) {
            reject(err);
          }
        
          resolve(obj);
        });
      });
    })
  })
}

function buildPdfReport(obj) {
  
  var {data, folder} = obj,
      options = { format: 'Legal'};

  return new Promise((resolve, reject) => {
    
    fs.readFile(`./.tmp/${folder}/html/index.html`, function(err, html) {
      if (err) {
        reject(err);
      }

      fs.stat(`./.tmp/${folder}/pdf`, function(err) {
        if (err) {
          fs.mkdir(`./.tmp/${folder}/pdf`, function(err, success) {
            if (err) {
              reject(err);
            }

            htmlPdf.create(html.toString(), options).toFile(`./.tmp/${folder}/pdf/index.pdf`, function(err) {
              if (err) {
                reject(err);
              }

              resolve(obj);
            });
          });
        }

        htmlPdf.create(html.toString(), options).toFile(`./.tmp/${folder}/pdf/index.pdf`, function(err) {
          if (err) {
            reject(err);
          }
        
          resolve(obj);
        });
      });
    })
  });
}

setData()
 .then(setReport)
 .then(buildHTMLReport)
 .then(buildEmailReport)
 .then(buildImgReport)
 .then(buildPdfReport)
 .catch(function(e){console.log(e.stack)});


// on directory change, run these again
/*// Example when handled through fs.watch listener
fs.watch('./tmp', { encoding: 'buffer' }, (eventType, filename) => {
  if (filename) {
    console.log(filename);
    // Prints: <Buffer ...>
  }
});*/
