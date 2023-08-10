# -*- coding: utf-8 -*-
"""
@author: jmrodriguezc
"""

# import global modules
import os
import sys
import argparse
import logging
import json
import yaml
from yaml.loader import SafeLoader


###################
# Parse arguments #
###################

parser = argparse.ArgumentParser(
    description='Execute the several programs',
    epilog='''Examples:
        
    python  runner.py
      -i   34792@cnic-24644/5827d39048cf068aa0e50359-0000000000000011
      -p   params.txt
    ''',
    formatter_class=argparse.RawTextHelpFormatter)
parser.add_argument('-i',   required=True, help='Execution identifier')
parser.add_argument('-p',   required=True, help='Parameter file')
args = parser.parse_args()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p')


####################
# Global variables #
####################

# Load the config file
with open( os.path.join(os.path.dirname(__file__), '../conf/config.yml') ) as f:
    CONFIG = yaml.load(f, Loader=SafeLoader)

JOB_DIR = CONFIG['job_dir']
STATUS = CONFIG['status'][0]

#################
# Main function #
#################
def main(args):
    '''
    Main function
    '''    
    logging.info("getting the input parameters...")
    job_id = args.i
    params = args.p

    # # getting the job directory
    job_dir = os.path.join( os.path.dirname(__file__), "..", JOB_DIR, job_id)

    logging.info("creating the status file...")
    status_json = json.dumps(STATUS, indent=4)
    
    logging.info("writing the status file...")
    with open( os.path.join(job_dir, 'status.json'), 'w') as outfile:
        outfile.write(status_json)
    

if __name__ == "__main__":
    # start main function
    logging.info('start script: '+"{0}".format(" ".join([x for x in sys.argv])))
    main(args)
    logging.info('end script')

