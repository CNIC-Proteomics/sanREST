/**
 *  @swagger
 *  components:
 *    schemas:
 *      Report:
 *        type: object
 *        required:
 *          - report
 *        properties:
 *          report:
 *            type: string
 *            format: text/plain
 *            description: The Report file
 * 
 *      Report_Fasta:
 *        type: object
 *        required:
 *          - peptide_header
 *          - protein_header
 *          - report
 *          - fasta
 *        properties:
 *          peptide_header:
 *            type: string
 *            description: Header name for the peptide level
 *            default: peptide
 *          protein_header:
 *            type: string
 *            description: Header name for the protein level
 *            default: protein
 *          report:
 *            type: string
 *            format: binary
 *            description: The Report file
 *          fasta:
 *            type: string
 *            format: binary
 *            description: The protein sequences in FASTA format
 *        encoding:
 *          report:
 *            contentType: text/plain; charset=utf-8
 *          fasta:
 *            contentType: text/plain; charset=utf-8
 * 
 *      QRegion:
 *        type: object
 *        required:
 *          - report
 *          - columns
 *        properties:
 *          qregion:
 *            type: string
 *            format: binary
 *            description: Table that contains protein and positions.
 *          columns:
 *            type: string
 *            description: List of columns separated by commas that contain the protein ID, as well as the start position and end position.
 *        encoding:
 *          qregion:
 *            contentType: text/plain; charset=utf-8
 * 
 */