/*module.exports = {
    // Database datasource
    maas: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        url: process.env.DB_URL,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        name: process.env.DB_NAME,
        connector: 'mongodb'
    },
    
    // Mail datasource
    gmail: {
        name: process.env.SMTP_NAME,
        connector: "mail",
        transports: [
          {
            type: "SMTP",
            host: process.env.SMTP_HOST,
            secure: true,
            port: process.env.SMTP_PORT,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASSWORD
            }
          }
        ]
    }
};

HOST_URL=https://maas-navid94.c9users.io
API_ROOT=/api
DB_HOST=ds027338.mlab.com
DB_USER=mintswe
DB_PASS=mint2016
DB_PORT=27338
DB_URL=mongodb://mintswe:mint2016@ds027338.mlab.com:27338/maas
DB_NAME=maas

 "maas": {
    "host": "ds027338.mlab.com",
    "port": 27338,
    "url": "mongodb://mintswe:mint2016@ds027338.mlab.com:27338/maas",
    "database": "maas",
    "password": "mint2016",
    "name": "maas",
    "user": "mintswe",
    "connector": "mongodb"
  },
  "gmail": {
    "name": "gmail",
    "connector": "mail",
    "transports": [
      {
        "type": "SMTP",
        "host": "smtp.gmail.com",
        "secure": true,
        "port": 465,
        "auth": {
          "user": "mint.swe.unipd@gmail.com",
          "pass": "mint.swe"
        }
      }
    ]
  }
  */