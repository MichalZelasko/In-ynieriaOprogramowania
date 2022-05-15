#!/bin/bash

# check python installation
if ! python3 --version ; then
    while true; do
        read -p "Python3 is not installed. Do you want to install? (required)" yn
        case $yn in
            [Yy]* ) sudo apt-get upgrade && sudo apt-get install python3.9; break;;
            [Nn]* ) exit;;
            * ) echo "Please answer yes or no.";;
        esac
    done
fi

echo "Upgrading pip"
pip install --upgrade pip

echo "Installing required packages"

if python3 -c 'import pkgutil; exit(not pkgutil.find_loader("requests"))'; then
    echo "requests found"
else
    echo "requests not found. Installing..."
    pip install requests
fi

if python3 -c 'import pkgutil; exit(not pkgutil.find_loader("fastapi"))'; then
    echo "fastapi found"
else
    echo "fastapi not found. Installing"
    pip install fastapi
fi

if python3 -c 'import pkgutil; exit(not pkgutil.find_loader("uvicorn[standard]"))'; then
    echo "uvicorn[standard] found"
else
    echo "uvicorn[standard] not found. Installing"
    pip install "uvicorn[standard]"
fi

if python3 -c 'import pkgutil; exit(not pkgutil.find_loader("json"))'; then
    echo "json found"
else
    echo "json not found. Installing..."
    pip install json
fi

if python3 -c 'import pkgutil; exit(not pkgutil.find_loader("dataclasses"))'; then
    echo "dataclasses found"
else
    echo "dataclasses not found. Installing..."
    pip install dataclasses
fi

#todo check for required angular dependencies, add here

