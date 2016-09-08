var loopback = require('loopback');

var app  = loopback();
var users = [];
var SA = [
  {
    "realm": "string",
    "username": "string",
    "email": "SA@maas.com",
    "password" : "password",
    "emailVerified": true,
    "id": "string"
  }
  ];
var companies = [];
var logged = true; //false quando si lavora con user-test
var loggedSA = false;
var externalDB = [];
var dbDSL = [];
var dbDSLAccess = [];

var mailData = {to: 'test@test.com',
                from: 'noreply@maas.com',
                subject: 'Welcome to MaaS',
                text: 'Please click on the link below to verify your email address and complete your registration:'};
function email(data){};


app.get('/', function (req, res) {
  res.status(200).send('ok');
});

app.post('/', function (req, res) {
  var action = "";
  req.on('data', function (chunk) {
    action += chunk;
    // console.log(user);
  });
  
  req.on('end', function () {
    if(action.includes("RESPONSE"))
    {
      res.status(200).send();
    }
    else
    {
      res.status(400).send('invalid request');
    }
    
  });
});

app.get('/api', function (req, res) {
  res.status(200).send('APIs are working correctly');
});

app.post('/users/signUp', function(req, res){//check 
    // var user = req.body;
    // console.log(req);
    
    var obj = "";
    var user;
  req.on('data', function (chunk) {
    obj += chunk;
    user = JSON.parse(obj);
    // console.log(user);
  });
    
    req.on('end', function () {
    if(user)
    {
        //console.log(user);
        if(user.password == user.confirmation)
        {
          var foundCompanyName = false;
          for(var i=0; i<companies.length; i++)
          {
            if(companies[i].name == user.company)
            {
              foundCompanyName = true;
            }
          }
          if(foundCompanyName){
              res.status(500).send({'error':'company name already existing'});
          }
          else{
            users.push(user);
            var toSend = {'error':'null', 'email':user.email, 'company':user.company};
            companies.push({'company':user.company, 'email':user.email});
            res.status(200).send(toSend);
          }
        }
        else
        {
            res.status(500).send({'error':'password and confirmation did not match'});
        }
    }
    else
    {
        res.status(500).send('no user in request');
    }
    
    });
});

app.get('/companies', function(req, res){
    // console.log(companies.length);
    res.status(200).send("" + companies.length);
});

app.post('/users/login', function(req, res){
    var obj = "";
    var loginData;
    
  req.on('data', function (chunk) {
    obj += chunk;
    loginData = JSON.parse(obj);
    // console.log(user);
  });
  
  req.on('end', function () {
    if(loginData.email == users[0].email && loginData.password == users[0].password)
    {
      logged = true;
      res.status(200).send("user login correct");
    }
    else
    {
      res.status(406).send("user not found in database");
    }
  });
});

app.get('/users/logout', function(req, res){
    if(logged){
      logged = false;
      res.status(200).send("user logged out correctly");
      logged = true;
    }
    else
      res.status(401).send("user not logged");
});

app.post('/users/editUser', function(req, res){
    var obj = "";
    var newData;
    
  req.on('data', function (chunk) {
    obj += chunk;
    newData = JSON.parse(obj);
    // console.log(user);
  });
  
  req.on('end', function () {
    if(logged)
    {
      users[0]['name'] = newData.name;
      users[0]['gender'] = newData.gender;
      res.status(200).send(users[0]);
    }
    else
    {
      res.status(401).send("user not logged");
    }
  });
});

app.get('/companies/testCompany/getUsers', function(req, res){
    var obj = "";
    var companyName = "testCompany";
    
  // req.on('data', function (chunk) {
  //   obj += chunk;
  //   companyName = JSON.parse(obj);
  //   // console.log(user);
  // });
  
  // req.on('end', function () {
    if(logged)
    {
      
      var usersCompany = [];
      
      for(var i=0; i<users.length; i++)
      {
        if(users[i].company == companyName)
        {
          usersCompany.push(users[i]);
        }
      }
      res.status(200).send(usersCompany);
    }
    else
    {
      res.status(401).send("user not logged");
    }
  // });
});

app.get('/companies/testCompany/getUser', function(req, res){
    var companyName = "testCompany";
    var userMail = "test@test.com";
    
    if(logged)
    {
      
      var user;
      
      for(var i=0; i<users.length; i++)
      {
        if(users[i].company == companyName && users[i].email == userMail)
        {
          user = users[i];
        }
      }
      res.status(200).send(user);
     
    }
    else
    {
      res.status(401).send("user not logged");
    }
});

app.get('/users/deleteUser', function(req, res){
    
    var companyName = "testCompany";
    var userMail = "del@test.com";
    
    
    users.push({ 'company' : 'testCompany',
  'email' : 'del@test.com',
  'password' : 'testPassword',
  'confirmation' : 'testPassword'});
    
    if(logged)
    {
      
      for(var i=0; i<users.length; i++)
      {
        if(users[i].company == companyName && users[i].email == userMail)
        {
           users.splice(i, 1);
        }
      }
      res.status(200).send();
     
    }
    else
    {
      res.status(401).send("user not logged");
    }
});

app.post('/users/getUser', function(req, res){
    
    var obj = "";
    var searchData;
    
    req.on('data', function (chunk) {
      obj += chunk;
      searchData = JSON.parse(obj);
      // console.log(user);
    });
    
    req.on('end', function () {
      if(logged)
      {
        var user;
        for(var i=0; i<users.length; i++)
        {
          if(users[i].email == searchData.email)
          {
            user = users[i];
          }
        }
        res.status(200).send(user);
      }
      else
      {
        res.status(401).send("user not logged");
      }
    });
});

app.post('/users/testUserId/changeRole', function(req, res){
    
  var obj = "";
  var searchData;
  
  req.on('data', function (chunk) {
    obj += chunk;
    searchData = JSON.parse(obj);
    // console.log(user);
  });
  
  req.on('end', function () {
    if(logged)
    {
      var user;
      for(var i=0; i<users.length; i++)
      {
        if(users[i].email == searchData.email)
        {
          if((searchData.role == 'Member' || searchData.role == 'Guest' || searchData.role == 'Administrator') && searchData.role != users[i].role)
            users[i].role = searchData.role;
          else
            res.status(401).send("user role not valid");
        }
      }
      res.status(200).send(user);
    }
    else
    {
      res.status(401).send("user not logged");
    }
  });
});

app.post('/users/testUserId/changePassword', function(req, res){
  var obj = "";
  var newData;
    
  req.on('data', function (chunk) {
    obj += chunk;
    newData = JSON.parse(obj);
    // console.log(user);
  });
  
  req.on('end', function () {
    if(logged)
    {
      users[0].password = newData.password;
      res.status(200).send(users[0]);
    }
    else
    {
      res.status(401).send("user not logged");
    }
  });
});

app.get('/users/sendInvite', function(req, res){
  if(logged){
    email(mailData);
    res.status(200).send("invitation mail sent correctly");
  }
  else
    res.status(401).send("user not logged");
});

app.get('/users/dsl/Collections', function(req, res) {
    if(logged){
      var user={'email' : 'test@test.com'};
      
       if(user)
       {
          var found = false;
          for(var i=0; i<dbDSL.length; i++){
            if(dbDSL[i].type=="Collection")
              for(var j=0; j<dbDSLAccess.length; j++)
                if(dbDSLAccess[j].dslId==dbDSL[i].id && dbDSLAccess[j].permission==true)
                  found=true;
          }
          res.status(200).send("user's collections");
       }
       else
       {
          res.status(404).send("could not obtain user");
       }
   }
   else{
     res.status(401).send("user not logged");
   }
});

app.get('/users/dsl/Documents', function(req, res) {
    if(logged){
      var user={'email' : 'test@test.com'};
      
       if(user)
       {
          var found = false;
          for(var i=0; i<dbDSL.length; i++){
            if(dbDSL[i].type=="Document")
              for(var j=0; j<dbDSLAccess.length; j++)
                if(dbDSLAccess[j].dslId==dbDSL[i].id && dbDSLAccess[j].permission==true)
                  found=true;
          }
          res.status(200).send("user's documents");
       }
       else
       {
          res.status(404).send("could not obtain user");
       }
   }
   else{
     res.status(401).send("user not logged");
   }
});

app.get('/users/dsl/Dashboards', function(req, res) {
    if(logged){
      var user={'email' : 'test@test.com'};
      
       if(user)
       {
          var found = false;
          for(var i=0; i<dbDSL.length; i++){
            if(dbDSL[i].type=="Dashboard")
              for(var j=0; j<dbDSLAccess.length; j++)
                if(dbDSLAccess[j].dslId==dbDSL[i].id && dbDSLAccess[j].permission==true)
                  found=true;
          }
          res.status(200).send("user's documents");
       }
       else
       {
          res.status(404).send("could not obtain user");
       }
   }
   else{
     res.status(401).send("user not logged");
   }
});

app.get('/users/dsl/Cells', function(req, res) {
    if(logged){
      var user={'email' : 'test@test.com'};
      
       if(user)
       {
          var found = false;
          for(var i=0; i<dbDSL.length; i++){
            if(dbDSL[i].type=="Cell")
              for(var j=0; j<dbDSLAccess.length; j++)
                if(dbDSLAccess[j].dslId==dbDSL[i].id && dbDSLAccess[j].permission==true)
                  found=true;
          }
          res.status(200).send("user's documents");
       }
       else
       {
          res.status(404).send("could not obtain user");
       }
   }
   else{
     res.status(401).send("user not logged");
   }
});

app.post('/users/testDSLid/dsl', function(req, res) {
    if(logged){
      var obj = "";
      var dsl;
      
      req.on('data', function (chunk) {
        obj += chunk;
        dsl = JSON.parse(obj);
      });
      
      req.on('end', function (chunk) {
       if(dsl)
       {
          dbDSL.push({'type' : dsl.type, 'name': dsl.name, 'source': dsl.source, 'createdBy' : dsl.email});
          res.status(200).send("user's dsl");
       }
       else
       {
          res.status(404).send("could not create dsl");
       }
      });
   }
   else{
     res.status(401).send("user not logged");
   }
});

app.post('/users/testDSLid/editDsl', function(req, res) {
    if(logged){
      var obj = "";
      var dsl;
      
      req.on('data', function (chunk) {
        obj += chunk;
        dsl = JSON.parse(obj);
      });
      
      req.on('end', function (chunk) {
       if(dsl)
       {
          for(var i=0; i<dbDSL.length; i++){
            if(dbDSL[i].type==dsl.type && dbDSL[i].name == dsl.name)
            {
              dbDSL[i] = dsl;
            }
          }
          res.status(200).send("user's dsl");
       }
       else
       {
          res.status(404).send("could not edit dsl");
       }
      });
   }
   else{
     res.status(401).send("user not logged");
   }
});

app.post('/users/testDSLid/deleteDsl', function(req, res) {
    if(logged){
      var obj = "";
      var dsl;
      
      req.on('data', function (chunk) {
        obj += chunk;
        dsl = JSON.parse(obj);
      });
      
      req.on('end', function (chunk) {
       if(dsl)
       {
          var length = dbDSL.length;
          for(var i=0; i<length; i++){
            if(dbDSL[i].type==dsl.type && dbDSL[i].name == dsl.name)
            {
              dbDSL.splice(i, 1);
            }
          }
          
          if(dbDSL.length == length - 1)
          {
            dbDSL.push(dsl);
            res.status(200).send("user's dsl");
          }
          else
          {
            res.status(500).send("could not delete dsl");
          }
       }
       else
       {
          res.status(404).send("could not find dsl to delete");
       }
      });
   }
   else{
     res.status(401).send("user not logged");
   }
});

app.post('/users/testDSLid/dslDef', function(req, res) {
    if(logged){
      var obj = "";
      var dsl;
      var dslDef = "";
      var found = false;
      
      req.on('data', function (chunk) {
        obj += chunk;
        dsl = JSON.parse(obj);
      });
      
      req.on('end', function (chunk) {
       if(dsl)
       {
          for(var i=0; i<dbDSL.length && !found; i++){
            if(dbDSL[i].type==dsl.type && dbDSL[i].name == dsl.name)
            {
              found = true;
            }
          }
          
          if(found)
          {
            res.status(200).send(dslDef);
          }
          else
          {
            res.status(500).send("could not get dsl definition");
          }
       }
       else
       {
          res.status(404).send("could not find dsl");
       }
      });
   }
   else{
     res.status(401).send("user not logged");
   }
});

app.get('/users/testDSLid/execDsl', function(req, res) {
    if(logged){
      var dsl={'email' : 'test@test.com'};
      var found = false;
      
       for(var i=0; i<dbDSL.length && !found; i++){
            if(dbDSL[i].email == dsl.email)
            {
              found = true;
            }
          }
          
          if(found)
          {
            res.status(200).send("dsl executed succesfully");
          }
          else
          {
            res.status(500).send("could not get dsl to execute");
          }
   }
   else{
     res.status(401).send("user not logged");
   }
});

app.get('/users/testDSLid/sendEmail', function(req, res) {
    if(logged){
      var dsl={'email' : 'test@test.com'};
      var found = false;
      var i = 0;
      
       for(; i<dbDSL.length && !found; i++){
            if(dbDSL[i].email == dsl.email)
            {
              found = true;
            }
          }
          
          if(found)
          {
            res.status(200).send("email to: " + dsl.email + " containing: " + dbDSL[i]);
          }
          else
          {
            res.status(500).send("could not send email containing dsl");
          }
   }
   else{
     res.status(401).send("user not logged");
   }
});

app.get('/users/testDSLid/exportView', function(req, res) {
    if(logged){
      var dsl={'email' : 'test@test.com'};
      var found = false;
      var i = 0;
      
       for(; i<dbDSL.length && !found; i++){
            if(dbDSL[i].email == dsl.email)
            {
              found = true;
            }
          }
          
          if(found)
          {
            res.status(200).send(dbDSL[i - 1].name);
          }
          else
          {
            res.status(500).send("could not export dsl view");
          }
   }
   else{
     res.status(401).send("user not logged");
   }
});

app.get('/users/testDSLid/exportDef', function(req, res) {
    if(logged){
      var dsl={'email' : 'test@test.com'};
      var found = false;
      var i = 0;
      
       for(; i<dbDSL.length && !found; i++){
            if(dbDSL[i].email == dsl.email)
            {
              found = true;
            }
          }
          
          if(found)
          {
            res.status(200).send(dbDSL[i - 1]);
          }
          else
          {
            res.status(500).send("could not export dsl definition");
          }
   }
   else{
     res.status(401).send("user not logged");
   }
});

app.get('/users/testDSLid/exportDefCsv', function(req, res) {
    if(logged){
      var dsl={'email' : 'test@test.com'};
      var found = false;
      var i = 0;
      
       for(; i<dbDSL.length && !found; i++){
            if(dbDSL[i].email == dsl.email)
            {
              found = true;
            }
          }
          
          if(found)
          {
            res.status(200).send("{'type', 'Collection', 'email', 'test@test.com', 'name', 'testCollection', 'source', 'testSource'}");
          }
          else
          {
            res.status(500).send("could not export dsl definition");
          }
   }
   else{
     res.status(401).send("user not logged");
   }
});

app.post('/users/dsl/import', function(req, res) {
    if(logged){
      var obj = "";
      var dsl;
      var found = false;
      
      req.on('data', function (chunk) {
        obj += chunk;
        dsl = JSON.parse(obj);
      });
      
      req.on('end', function (chunk) {
       if(dsl)
       {
          for(var i=0; i<dbDSL.length && !found; i++){
            if(dbDSL[i].type==dsl.type && dbDSL[i].name == dsl.name)
            {
              found = true;
            }
          }
          
          if(!found)
          {
            dbDSL.push(dsl);
            res.status(200).send("dsl imported correctly");
          }
          else
          {
            res.status(500).send("dsl already exists");
          }
       }
       else
       {
          res.status(404).send("could not import dsl");
       }
      });
   }
   else{
     res.status(401).send("user not logged");
   }
});

/////////////////////////////////////////////////////SuperAdmin//////////////////////////////////////////////////


app.post('/SuperAdmins/login', function(req, res){
   var obj = "";
  var loginData;
  
  if(!loggedSA){
    req.on('data', function (chunk) {
      obj += chunk;
      loginData = JSON.parse(obj);
      // console.log(user);
    });
    
    req.on('end', function () {
      if(loginData.email == SA[0].email && loginData.password == SA[0].password)
      {
        loggedSA = true;
        res.status(200).send("SuperAdmin login correct");
      }
      else
      {
        res.status(406).send("SuperAdmin not found in database");
      }
    });
  }
  else{
    res.status(406).send("SuperAdmin already logged");
  }
});

app.get('/SuperAdmins/logout', function(req, res){
    if(loggedSA){
      loggedSA = false;
      res.status(200).send("SuperAdmin logged out correctly");
      loggedSA = true;
    }
    else
      res.status(401).send("SuperAdmin not logged");
});

app.post('/SuperAdmins/impersonate', function(req, res){//check
    var obj = "";
    var user;
  req.on('data', function (chunk) {
    obj += chunk;
    user = JSON.parse(obj);
    // console.log(user);
  });
    
    req.on('end', function () {
    if(user)
    {
        SA.push(user);
        if(SA.length > 1)
        {
          res.status(200).send('user impersonated correctly');
        }
        else
        {
          res.status(500).send('error impersonating user');
        }
    }
    else
    {
        res.status(500).send('no user in request');
    }
    
    });
});

app.post('/companies/createCompany', function(req, res){//check
    var obj = "";
    var company;
  req.on('data', function (chunk) {
    obj += chunk;
    company = JSON.parse(obj);
    // console.log(user);
  });
    
    req.on('end', function () {
    if(company)
    {
        // companies.push(company);
        if(companies.indexOf(company) == -1)
        {
          companies.push(company);
          res.status(200).send('company created correctly');
        }
        else
        {
          res.status(500).send('error creating company');
        }
    }
    else
    {
        res.status(500).send('no company in request');
    }
    
    });
});

app.get('/companies/testCompany', function(req, res){
    if(loggedSA)
    {
      
      var company = companies[0];
      res.status(200).send(company);
     
    }
    else
    {
      res.status(401).send("SuperAdmin not logged");
    }
});

app.post('/companies/editCompany', function(req, res){//check
    var obj = "";
    var company;
  req.on('data', function (chunk) {
    obj += chunk;
    company = JSON.parse(obj);
    // console.log(user);
  });
    
    req.on('end', function () {
    if(company)
    {
        // companies.push(company);
        if(companies.indexOf(company))
        {
          companies[1].email = 'test@test2.com';
          res.status(200).send('company edited correctly');
        }
        else
        {
          res.status(500).send('error editing company');
        }
    }
    else
    {
        res.status(500).send('no data in request');
    }
    
    });
});

app.get('/companies/deleteCompany', function(req, res){
    
    var companyName = "testCompany";
    var userMail = "del@test.com";
    
    
    companies.push({ 'company' : 'testCompany',
  'email' : 'del@test.com'});
    
    if(loggedSA)
    {
      
      for(var i=0; i<companies.length; i++)
      {
        if(companies[i].company == companyName && companies[i].email == userMail)
        {
           companies.splice(i, 1);
        }
      }
      res.status(200).send();
     
    }
    else
    {
      res.status(401).send("user not logged");
    }
});


/////////////////////////////////////////////////////Admin-Owner//////////////////////////////////////////////////


app.post('/Companies/externalDatabases', function(req, res) {
   if(logged){
    var obj = "";
    var ext;
    req.on('data', function (chunk) {
      obj += chunk;
      ext = JSON.parse(obj);
      externalDB.push(ext);
      res.status(200).send("db connected");
    }
   );
   }
   else{
     res.status(401).send("user not logged");
   }
});

app.get('/Companies/testExternalDB/deleteExternalDatabase', function(req, res){
    
    var companyName = "testCompany";
    var dbName = 'testName';
    // var userMail = "del@test.com";
    
    if(externalDB.length > 0)
    {
      // console.log(externalDB.length);
      // console.log(externalDB[0]);
      for(var i=0; i<externalDB.length; i++)
      {
        if(externalDB[i].name == dbName && externalDB[i].companyId == companyName)
        {
           externalDB.splice(i, 1);
        }
      }
      res.status(200).send();
     
    }
    else
    {
      res.status(404).send("db not found");
    }
});

app.get('/Companies/testExternalDB', function(req, res){
    var length = externalDB.length;
    
    if(length == 0)
    {
      externalDB.push({"name": "testName",
              "connString": "testLink",
              "connected": "true",
              "companyId": "testCompany"});
      length = externalDB.length;
    }
    
    if(externalDB[0])
    {
      var result = {'company': externalDB[0].companyId};
      res.status(200).send(result);
    }
    else
    {
      res.status(404).send("db not found");
    }
});

app.get('/externalDatabases/testExternalDB', function(req, res){
    var length = externalDB.length;
    
    if(length > 0)
    {
      res.status(200).send();
    }
    else
    {
      res.status(404).send("db not found");
    }
});

app.post('/externalDatabases/allowUser', function(req, res) {
   if(logged){
    var obj = "";
    var user;
    req.on('data', function (chunk) {
      obj += chunk;
      user = JSON.parse(obj);
    });
    
    req.on('end', function (chunk) {
     if(user)
     {
        res.status(200).send("user allowed");
     }
     else
     {
        res.status(404).send("could not obtain user");
     }
    });
   }
   else{
     res.status(401).send("user not logged");
   }
});

app.post('/externalDatabases/denyUser', function(req, res) {
   if(logged){
    var obj = "";
    var user;
    req.on('data', function (chunk) {
      obj += chunk;
      user = JSON.parse(obj);
    });
    
    req.on('end', function (chunk) {
     if(user)
     {
        res.status(200).send("user denied");
     }
     else
     {
        res.status(404).send("could not obtain user");
     }
    });
   }
   else{
     res.status(401).send("user not logged");
   }
});

var onChange = function() {
  return true;
}

var getState = function() {
  return {};
}

var emitChange = function() {
  return 'CHANGE_OCCURRED';
}

var addChangeListener = function() {
  return 0;
}

var removeChangeListener = function() {
  return 0;
}

var getSubjectState = function() {
  return {};
}

//app.start = function() {
  // start the web server
  var server = app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    // if (app.get('loopback-component-explorer')) {
    //   var explorerPath = app.get('loopback-component-explorer').mountPath;
    //   console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    // }
  });
//};
module.exports = server;
module.exports.onChange = onChange;
module.exports.getState = getState;
module.exports.emitChange = emitChange;
module.exports.addChangeListener = addChangeListener;
module.exports.removeChangeListener = removeChangeListener;
module.exports.getSubjectState = getSubjectState;