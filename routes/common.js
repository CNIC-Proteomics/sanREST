// Required modules
const path = require('path');
const find_remove_sync = require('find-remove');
const fs = require('fs');
const read_yaml = require('read-yaml-file');
let cProcess = require('child_process');


/**
 * 
 * COMMON VARIABLES
 * 
 **/

// Read the config file
const root_dir = path.join(__dirname, '..')
const config = read_yaml.sync( path.join(root_dir, 'conf/config.yml') );

// Get the specific folders
const job_dir = config.job_dir; // folder with the jobs
const src_dir = config.src_dir; // folder with the local programs
const sanpro_dir = config.sanpro_dir; // folder with the external programs

// Python executable
const python_exec = config.python_exec;

/**
 * 
 * COMMON FUNCTIONS
 * 
 **/

// Remove the files older than 1 month
function remove_uploads(dir) {
    // Remove the files older than 30 days
    function _remove_uploads(dir) {
        console.log(`_remove_uploads: ${dir}`);
        // let result = find_remove_sync(dir, { dir: '*' });
        let result = find_remove_sync(dir, {
            dir: '*',
            // age: { seconds: 60 },
            age: { seconds: 30 * 24 * 60 * 60 }, // 30 days in seconds
        //   extensions: '.jpg',
        //   limit: 100
        });
        console.log(result);
    }
    // every 1 day call the function that delete the files
    setInterval( function() { _remove_uploads(dir) } , 1 * 24 * 60 * 60) // every day
}

// Create a directory recursively
function create_directory(dir) {
    try {
        if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        }
    } catch (err) {
        console.error(err);
    }
}



// Exec sync process
function exec_sync(script, cmd) {
    try {
        console.log(cmd);
        proc = cProcess.execSync(cmd);
    } catch (ex) {
        console.log(`stderr: ${script}: ${ex.stderr.toString()} \n ${ex.message}`);
    }
}

// Exec async process
function exec_async(cmd) {
    // define the runner script
    let script = path.join(root_dir, src_dir, 'runner.py');

    // re-create the command line
    cmd = `${python_exec} ${script} ${cmd}`

    // execute command line
    console.log(`CMD: ${cmd}`);
    proc = cProcess.exec(cmd);

    // Handle on stderr
    proc.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });
  
    // Handle on exit event
    proc.on('close', (code) => {
        console.log(`Child exited with code ${code}`);
    });  
}


module.exports = {
    // variables
    root_dir: root_dir,
    job_dir: job_dir,
    src_dir: src_dir,
    sanpro_dir: sanpro_dir,
    python_exec: python_exec,
    // functions
    remove_uploads: remove_uploads,
    create_directory: create_directory,
    exec_async: exec_async,
    exec_sync: exec_sync,
};