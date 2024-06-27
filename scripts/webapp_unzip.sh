#!/bin/bash

# Check if the current working directory is "/tmp"
if [ "$PWD" == "/tmp/" ]; then
  echo "In /tmp directory."
else
  # Change to the /opt directory and check the exit status
  if cd "/tmp/"; then
    echo "Changed to /tmp directory."
  else
    echo "Failed to change to /tmp directory."
    exit 1
  fi
fi

# Unzip the webapp.zip file to /opt directory
sudo mkdir -p /opt/dist/webapp
sudo mv /tmp/webapp.zip /opt/dist/webapp/webapp.zip

# Print the directory structure
ls -lrth /opt/dist/

# Change directory to /opt/dist and unzip webapp.zip
if cd /opt/dist/webapp/ && sudo unzip -o "webapp.zip"; then
  echo "File unzipped"
  # Perform npm install
  if sudo npm install; then
    echo "npm install completed"
  else
    echo "npm install error"
    exit 1
  fi
else
  echo "Failed to change directory"
  exit 1
fi
