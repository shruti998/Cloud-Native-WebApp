const winston = require('winston');
const fs = require('fs');

// Define both the paths
const centosFilePath = '/var/log/webapp.service/myapp.log';
const localFilePath = '/tmp/myapp.log'; 
let logFilePath;

try {
  // Checking if the directory exists in Centos
  const logDirectory = centosFilePath.substring(0, centosFilePath.lastIndexOf('/'));
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
  }

  logFilePath = centosFilePath;
} catch (error) {
  console.error('Error while setting log file path:', error);
  logFilePath = localFilePath;
}

const logger = winston.createLogger({
  level: 'debug', 
  format: winston.format.combine(
    winston.format.timestamp(),
 winston.format.errors({ stack: true}),
winston.format.splat(),
winston.format.json()
),
  transports: [
    new winston.transports.File({ filename: logFilePath })
  ]
});

module.exports = logger;