#!/bin/bash

USER="csye6225"
GROUP="csye6225"

sudo chown -R $USER:$GROUP /etc/environment
sudo chmod 644 /etc/environment


# Changing folder where the application 
cd /opt/dist/webapp



# # Start your Node.js application using npm
npm start