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
    fileSize: 1024 * 1024 * 100 // 100Mb
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
 *           text/tab-separated-values;charset=UTF-8:
 *             schema:
 *              type: string
 *              format: binary
 *       500:
 *         description: Some server error
 */

// *     responses:
// *       200:
// *         description: Report containg the peptide positions
// *         content:
// *           text/plain;charset=utf-8:
// *             schema:
// *               type: file
// *       500:
// *         description: Some server error

router.post('/add_pep_position', upload_files_job.any(), function (req, res) {

  // get the request identifier (job id)
  let job_id = req.rid;

  // obtain the path from the request files
  // console.log(req.files);
  let r_path = req.files.find(f => f.fieldname === 'report').path;
  let f_path = req.files.find(f => f.fieldname === 'fasta').path;
  let in_report = path.join( common.root_dir, r_path);
  let in_fasta = path.join( common.root_dir, f_path);
  // obtain the rest of parameters from the request body
  // console.log(req.body);
  let in_pep_label = req.body.peptide_header;
  let in_pro_label = req.body.protein_header;
  // create output based on input file
  let out_report = path.join( path.parse(in_report).dir, `${path.parse(in_report).name}.out.tsv`);
  let out_log = path.join( path.parse(in_report).dir, 'job.log');

  // // create the command line
  // let script = 'positioner/add_pep_position.py';
  // // let cmd = `"${common.python_exec}" "${path.join('S:/U_Proteomica/UNIDAD/DatosCrudos/jmrodriguezc/projects/sanpro/src/positioner', script)}" \
  // let cmd = `"${common.python_exec}" "${path.join(common.sanpro_dir, script)}" \
  // -i "${in_report}" \
  // -f "${in_fasta}" \
  // -hp "${in_pep_label}" \
  // -hq "${in_pro_label}" \
  // -o  "${out_report}" \
  // 1> ${out_log} 2>&1`;

  // // exec the program in sync mode
  // // common.exec_async(script, cmd);
  // common.exec_sync(script, cmd);

  // // read the output file
  // try {
  //   const data = fs.readFileSync(out_report, 'utf8');
  //   console.log("OK");

  //   // res.set('Content-Type', 'text/plain;charset=utf-8');
  //   // res.send({ "msg": data });

  // } catch (err) {
  //   console.error(err);
  // }

  console.log("pasa");

  res.download(`${path.join(common.src_dir, 'kk.tsv')}`);

});

module.exports = router;
