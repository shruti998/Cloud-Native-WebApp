#!/bin/bash
APP_NAME="webapp"
APP_DIRECTORY="/opt/dist/webapp"
USER="csye6225"
GROUP="csye6225"

# Create a system group
sudo groupadd ${GROUP}

sudo chmod +x /opt/dist/webapp/scripts/run_app.sh

# Create a system user

sudo useradd --system --shell /usr/sbin/nologin --no-create-home -g $GROUP $USER

sudo mkdir -p /var/log/$APP_NAME.service

sudo touch /var/log/$APP_NAME.service/out.log /var/log/$APP_NAME.service/error.log

cat <<EOF | sudo tee /etc/systemd/system/$APP_NAME.service
[Unit]
Description=$APP_NAME
ConditionPathExists=/opt/dist/webapp
After=network.target

[Service]
Type=simple
EnvironmentFile=-/etc/environment
WorkingDirectory=/opt/dist/webapp
ExecStart=$APP_DIRECTORY/scripts/run_app.sh start
ExecStop=$APP_DIRECTORY/scripts/run_app.sh stop
Restart=always
User=$USER
Group=$GROUP
Environment=NODE_ENV=production
StandardOutput=file:/var/log/$APP_NAME.service/out.log
StandardError=file:/var/log/$APP_NAME.service/error.log
SyslogIdentifier=csye6225

[Install]
WantedBy=multi-user.target
WantedBy=cloud-init.target
EOF




# Set permissions on the service unit file
sudo chmod 664 "/etc/systemd/system/$APP_NAME.service"
sudo chown $USER:$GROUP /var/log/$APP_NAME.service/
sudo chmod 755 /var/log/$APP_NAME.service/
sudo chown -R $USER:$GROUP /opt/dist/webapp
sudo chmod -R 755 /opt/dist/webapp
sudo systemctl daemon-reload
sudo systemctl enable webapp