# Newsletter Builder

Using structured JSON file to create a simple email newsletter. Also creates HTML, JPG, and PDF versions for re-use in different context.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them

```
Developed on MacOS Sierra (10.12.6) 
node >= v9.0.0
```

### Installing

After cloning the repository, run

```
npm install
```

in project root directory. Then create structured JSON like 

```
// Filename
// data/<name-of-newsletter>.js

var data = [
  {
    pageName: 'YOUR REPORT TITLE',
    pageTitle: 'Hey there here is your report!!!'
  },
  /* A section with sample table with 2 columns and 4 rows */
  {
    sectionName: 'COMPETITOR REPORT',
    components: [
      {
        type: 'TABLE',
        data: [
          ['Domain', 'PA'],
          ['leanin.org', '67'],
          ['apartmenttherapy.com', '62'],
          ['techcrunch.com', '57'],
          ['forbes.com', '50']
        ]
      }
    ]
  },
  /* A sections with sample list with special icons for bullets */
  {
    sectionName: 'PAGE SPEED',
    components: [
      {
        type: 'DL',
        data: [
          {
            label: 'Title',
            text: 'Google penalizes websites that are slow to load.'
          },
          {
            grade: 'error',
            text: 'Mobile: Poor (57/100)'
          },
          {
            grade: 'success',
            text: 'Desktop: Good (85/100)'
          }
        ]
      }
    ]
  },
  /* A sections with 2 sample lists with default bullets */
  {
    sectionName: 'GENERAL SUGGESTIONS',
    components: [
      {
        type: 'DL',
        style: 'default',
        data: [
          {
            label: 'Title',
            text: 'On site links'
          },
          {
            text: 'Build more pages and build links between pages.'
          },
          {
            text: 'Create relevant external links for related and relevant content.'
          }
        ]
      },
      {
        type: 'DL',
        style: 'default',
        data: [
          {
            label: 'Title',
            text: 'Off site links'
          },
          {
            text: 'Build relationships with external related and relevant site authors.'
          },
          {
            text: 'Provide valuable related and relevant content that links back to your site.'
          }
        ]
      }
    ]
  }
];


module.exports = data;

```

Finally run

```
node index.js <name-of-newsletter>
```

If successful, you should see a folder with name .tmp/\<name-of-newsletter\> and 4 sub-directories /email /html /img /pdf.

## Customizing your report

Each component in the data object accepts an optional "style" property where you can put space separated string of values. These values will only apply to the parent container for the component (e.g. type: 'DL' will only have classes on the DL of the renedered component).

Once your classes have been established, you can extend the base CSS for your report by placing a CSS file with your styles. The file should be named like css/custom/\<name-of-newsletter\>.css. Here you can apply css to your classes as well as override any default css created by the plugin.


## Running the tests

Test are built on mocha/chai and are located in test/ folder

```
npm test
```

## Built With

* [juice](https://www.npmjs.com/package/juice) - Given HTML, juice will inline your CSS properties into the style attribute.
* [webshot](https://www.npmjs.com/package/webshot) - Webshot provides a simple API for taking webpage screenshots.
* [html-pdf](https://www.npmjs.com/package/html-pdf) - HTML to PDF converter that uses phantomjs



## Nice to haves

* Show progress in terminal while building
* Optimize the output files
* Package (zip) the output
* Livereload on file change - [forever](https://github.com/foreverjs/forever)
* Break index.js out into sub-modules
* Reduce number of callbacks used in sub-modules
* Use asyc/await instead of promises where appropriate - [stackoverflow](https://stackoverflow.com/questions/40593875/using-filesystem-in-node-js-with-async-await#answer-42351088)
* Tests


## License

Copyright 2017 Kalim Fleet

Licensed under the Apache License, Version 2.0 (the "License"); you may use this file  in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
