// Require modules
const path = require('path');
const express = require('express');
const router = express.Router();
               

/**
 * 
 * REST services
 * 
 **/

/**
 * @swagger
 * tags:
 *   name: displayer
 *   description: Operations that display statistics
 * /displayer/visual_position:
 *   get:
 *     tags: [displayer]
 *     summary: KK
 *     responses:
 *       200:
 *         description: Report containg the peptide position.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
 *       500:
 *         description: Some server error
 */


router.get('/visual_position', function (req, res) {
  let req_id = req.rid;
  res.send({ "req_id": req_id });
});

module.exports = router;
