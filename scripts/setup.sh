#!/bin/bash

# # Install MariaDB server
# sudo yum install -y mariadb-server

# # Start MariaDB service
# sudo systemctl start mariadb
# sudo systemctl enable mariadb


# # Secure MariaDB installation
# sudo mysql_secure_installation <<EOF

# y
# root
# root
# y
# y
# y
# y
# EOF

# # Define your MariaDB root password
# DB_USER=root
# DB_PASSWORD=root
# DB_NAME=healthz

# # create database

# sudo mysql -u root -p"$DB_PASSWORD" -e "CREATE DATABASE $DB_NAME;"


# # Show databases
# sudo mysql -u root -p"$DB_PASSWORD" -e "SHOW DATABASES;"

# # Clean up (optional)
# sudo yum clean all
