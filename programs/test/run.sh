#!/bin/bash
if [ $# -lt 2 ]; then
    printf "Usage: ./run_python_script.sh <name> <age> [height]"
    exit 1
fi

name=$1
age=$2
height=$3

cd ./programs/test || { printf "Directory not found!"; exit 1; }
output=$(python3 test.py $name $age $height 2>&1)
exit_code=$?

printf "$output\n"

if [ $exit_code -ne 0 ]; then
    printf "ERROR: Python script failed with exit code $exit_code.\n"
else
    printf "SUCCESS: Python script ran successfully!\n"
fi