// Require modules
const path = require('path');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

const common = require("./common.js");                

/**
 * 
 * COMMON FUNCTIONS
 * 
 **/
// Handle the disk storage for the files
// Create the unique output directory
const storage = multer.diskStorage({
  destination(req, file, cb) {
    let dir = path.join(common.job_dir, req.rid);
    common.create_directory(dir);
    cb(null, dir);
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}.tsv`)
  },
});
const upload_files_job = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 1000 // 1000Mb
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/octet-stream'];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error('Invalid file type');
      error.code = 'INVALID_FILE_TYPE';
      return cb(error, false);
    }
    cb(null, true);
  }
});


/**
 * 
 * REST services
 * 
 **/


/**
 * @swagger
 * tags:
 *   name: positioner
 *   description: Operations that add positions
 * /positioner/add_pep_position:
 *   post:
 *     tags: [positioner]
 *     summary: Include the peptide position within the protein in the report
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Report_Fasta'
 *     responses:
 *       200:
 *         description: Report containg the peptide positions
 *         content:
 *           application/zip:
 *             schema:
 *              type: string
 *              format: binary
 *       500:
 *         description: Some server error
 */

// *     responses:
// *       200:
// *         description: Report containing the peptide positions
// *         content:
// *           text/tab-separated-values;charset=UTF-8:
// *             schema:
// *               type: file
// *       500:
// *         description: Some server error

router.post('/add_pep_position', upload_files_job.any(), function (req, res) {

  // get the request identifier (job id)
  let job_id = req.rid;

  // obtain the inputs files from the request
  // console.log(req.files);
  let r_path = req.files.find(f => f.fieldname === 'report').path;
  let f_path = req.files.find(f => f.fieldname === 'fasta').path; 
  let in_report = path.join( common.root_dir, r_path);
  let in_fasta = path.join( common.root_dir, f_path);
  // obtain the output path from the request files
  let out_dir = path.join( common.root_dir, req.files.find(f => f.fieldname === 'report').destination );


  // obtain the rest of parameters from the request body
  // console.log(req.body);
  let in_pep_label = req.body.peptide_header;
  let in_pro_label = req.body.protein_header;
  // create output based on input file
  let out_report_n = `${path.parse(in_report).name}.out.tsv`;
  let out_report = path.join(out_dir, out_report_n);
  let out_log_n = 'job.log';
  let out_log = path.join(out_dir, out_log_n);

  // create the command line
  let script = 'positioner/add_pep_position.py';
  // let cmd = `"${common.python_exec}" "${path.join('S:/U_Proteomica/UNIDAD/DatosCrudos/jmrodriguezc/projects/sanpro/src/positioner', script)}" \
  let cmd = `"${common.python_exec}" "${path.join(common.sanpro_dir, script)}" \
  -i "${in_report}" \
  -f "${in_fasta}" \
  -hp "${in_pep_label}" \
  -hq "${in_pro_label}" \
  -o  "${out_report}" \
  1> ${out_log} 2>&1`;

  // exec the program in sync mode
  // common.exec_async(script, cmd);
  common.exec_sync(script, cmd);

  // zip the outputs
  let out_zip = path.join(out_dir, `${job_id}.zip`);
  let archive = common.zip_files(out_zip, out_dir, [out_report_n, out_log_n]);
  
  // finalize the archive
  archive.finalize().then(function(){
    console.log('done zip');
    res.set('Content-Type', 'application/zip');
    res.download(out_zip);          
  });

});

/**
 * @swagger
 * tags:
 *   name: positioner
 *   description: Operations that add positions
 * /positioner/add_appris_annots:
 *   post:
 *     tags: [positioner]
 *     summary: Retrieve APPRIS annotations for the given protein and positions
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/QRegion'
 *     responses:
 *       200:
 *         description: Table containing the APPRIS annotations for the given QRegion (protein and positions)
 *         content:
 *           application/zip:
 *             schema:
 *              type: string
 *              format: binary
 *       500:
 *         description: Some server error
 */

router.post('/add_appris_annots', upload_files_job.any(), function (req, res) {

  // get the request identifier (job id)
  let job_id = req.rid;

  // obtain the inputs files from the request
  // console.log(req.files);
  let r_path = req.files.find(f => f.fieldname === 'qregion').path;
  let in_report = path.join( common.root_dir, r_path);
  // obtain the output path from the request files
  let out_dir = path.join( common.root_dir, req.files.find(f => f.fieldname === 'qregion').destination );


  // obtain the rest of parameters from the request body
  // console.log(req.body);
  let in_columns = req.body.columns;
  // create output based on input file
  let out_report_n = `${path.parse(in_report).name}.out.tsv`;
  let out_report = path.join(out_dir, out_report_n);
  let out_log_n = 'job.log';
  let out_log = path.join(out_dir, out_log_n);

  // create the command line
  let script = 'positioner/get_appris.py';
  // let cmd = `"${common.python_exec}" "${path.join('S:/U_Proteomica/UNIDAD/DatosCrudos/jmrodriguezc/projects/sanpro/src/positioner', script)}" \
  let cmd = `"${common.python_exec}" "${path.join(common.sanpro_dir, script)}" \
  -i "${in_report}" \
  -c "${in_columns}" \
  -d "${in_appris_db}" \
  -o  "${out_report}" \
  1> ${out_log} 2>&1`;

  // exec the program in sync mode
  // common.exec_async(script, cmd);
  common.exec_sync(script, cmd);

  // zip the outputs
  let out_zip = path.join(out_dir, `${job_id}.zip`);
  let archive = common.zip_files(out_zip, out_dir, [out_report_n, out_log_n]);
  
  // finalize the archive
  archive.finalize().then(function(){
    console.log('done zip');
    res.set('Content-Type', 'application/zip');
    res.download(out_zip);          
  });

});


module.exports = router;
