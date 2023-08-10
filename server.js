// Require modules
const path = require('path');
const express = require('express');
const body_parser = require('body-parser');
const ruid = require('express-ruid');
const swagger_jsdoc = require('swagger-jsdoc');
const swagger_ui = require('swagger-ui-express');

const common = require('./routes/common.js');

// Create the app
const app = express();
app.use(
  body_parser.urlencoded({
    extended: true,
  })
);
app.use(body_parser.json());

// Add request id
app.use(ruid());


// Declare the REST services
app.use('/positioner', require('./routes/positioner.js'));
app.use('/displayer', require('./routes/displayer.js'));


// Enable the function that removes the older uploads
let job_dir = path.join(__dirname, common.job_dir);
common.remove_uploads(job_dir);


// Add the listening port
const PORT = process.env.PORT || 3000;
app.listen(PORT);


/** SWAGGER SERVER **/

// Create Swagger options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "sanRESTful API with Swagger",
      version: "0.0.1",
      description:
        "A RESTful API that describes the web services and the operations for the report files of iSanXoT",
      license: {
        name: "CC-BY-NC-ND-4.0",
        url: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
      },
      contact: {
        name: "Jose Manuel Rodríguez",
        url: "https://github.com/CNIC-Proteomics",
        email: "jmrodriguezc@cnic.es",
      },
    },
    servers: [
      {
        url: "http://172.31.203.242:3000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

// Add the Swagger document
const specs = swagger_jsdoc(options);
app.use(
  "/api-docs",
  swagger_ui.serve,
  swagger_ui.setup(specs, {
    explorer: true,
    customCssUrl: 'css/theme-newspaper.css',
    swaggerOptions: {
      displayRequestDuration: true,
      docExpansion: "none"
    }
  })
);

console.debug("Server listening on port: " + PORT);
