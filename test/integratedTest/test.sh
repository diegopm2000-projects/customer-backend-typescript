#!/bin/bash

ENVIRONMENT=$1
echo $ENVIRONMENT

npx newman run API_Customer.col.json -e ${ENVIRONMENT} --folder 'Automatic Tests' --insecure