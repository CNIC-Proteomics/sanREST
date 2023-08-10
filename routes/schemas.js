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
 */