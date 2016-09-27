MaaS: MongoDB as an Admin Service
====

MaaS is a System based on **Node.js** and **MongoDB**. It is intended for company Administrators, especially Businessmen,
who may not be keen to the interaction with complex technological appliances, helping them in making important managerial decisions.  
Being a service, the system provides a stable and ready-to-use environment, which embodies
all the necessary functionalities to visualize the data stored in databases and display them in a user-friendly manner.

Usage
---

If you are intalling this system on your server for the first time, you should use the following lines of code (in the exact same order in which they are written)
to correctly configure the dependencies of the Node.js environment.

```
npm install
npm install --global gulp-cli
gulp build
node .
```
after executing these commands, you can open the server root page to see the application running.

Configuration variables
---

In order to run this application, you have to create a `.env` file containg the project configuration variables inside the root directory of the application. 
You can find below an example of how a `.env` file should look like:

```
HOST_NAME=maas-navid94.c9users.io
HOST_URL=https://maas-navid94.c9users.io
HOST_PORT=8080
API_ROOT=/api

DB_HOST=ds027338.mlab.com
DB_USER=mintswe
DB_PASS=******
DB_PORT=27338
DB_URL=mongodb://mintswe:mint2016@ds027338.mlab.com:27338/maas
DB_NAME=maas

SMTP_NAME=gmail
SMTP_HOST=smtp.gmail.com
SMTP_USER=mint.swe.unipd@gmail.com
SMTP_PASSWORD=******
SMTP_PORT=465

SUPERADMIN_EMAIL=superadmin@gmail.com
SUPERADMIN_PASSWORD=******
```
Demo
---
You can find a demo of this application at this [link](https://maas-swe.herokuapp.com/#/).  

User credentials:

* You can sign up from the proper page.

DSL Guide
---

You can check the guide to our [*Domain Specific Language*](https://github.com/MINT-team/MaaS/wiki)
