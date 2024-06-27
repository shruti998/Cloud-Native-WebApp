#!/bin/bash

# Define the content of the .env file
cat <<EOF | sudo tee /opt/dist/webapp/.env >/dev/null
PORT=8080
HOST=localhost
DB_USER=root
DB_PASSWORD=root
DIALECT=mysql
DATABASE=healthz
EOF
echo "Created .env file"
# Change permissions of the .env file
sudo chmod 600 /opt/dist/webapp/.env


