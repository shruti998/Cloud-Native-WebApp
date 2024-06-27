# webapp
# CSYE 6225- Network Structure & Cloud Computing(Spring 2024)

# Steps to Configure Credential in the app
1. Create a .env file and place the value for the variable PORT,HOST,DB_USER,DB_PASSWORD.
   
# Steps to run the code
1. npm install 
2. npm start

# Testing
1. npm test

## Running the application on centos

# Login
ssh -i ~/.ssh/private_key_file root@IP

1. sudo yum update
# Mariadb

2. sudo yum install mariadb-server
3. sudo systemctl start mariadb
4. sudo systemctl status mariadb
5. sudo systemctl enable mariadb
6. sudo mysql_secure_installation
7. mysqladmin -u root -p version
# Nodejs

8. sudo yum install -y gcc-c++ make
9. curl -sL https://rpm.nodesource.com/setup_14.x | sudo bash -
10. sudo yum install -y nodejs

# Unzip 

11. sudo yum install -y git unzip
   
# Transfer file
12.  scp -i .ssh/private_key_file  source  destination
   
# Unzip file 
13. unzip filename
14. Creating .env file
    
# Testing
15. npm test
    
# Assignment4
- packer build will generate the image id
# Assignment5
- mysql -u webapp -h db_instance_private_ip -p
- removed the mysql ssetup from the packer

# Assignment6
- chnage the path in logger.js from localFilePath = '/tmp/myapp.log' to localFilePath = './myapp.log' for testing in local
  

## References

https://www.turing.com/kb/mysql-connection-with-node-js-using-sequelize-and-express

# When a pull request merges, the pull request is automatically closed
https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#running-your-pull_request-workflow-when-a-pull-request-merges

Service
https://medium.com/@benmorel/creating-a-linux-service-with-systemd-611b5c8b91d6

# Github Workflow
- Update the secrets
- update the vars

