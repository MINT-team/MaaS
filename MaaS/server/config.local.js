var app = require('./server.js');

module.exports = {
  remoting: {
    errorHandler: {
      handler: function(err, req, res, next) {
        var DSL = app.models.DSL;
        if(req.url.match("compileDefinition") && err.statusCode == 401 )
        {
          DSL.findById(req.remotingContext.args.id, function(err, DSLInstance) {
            if(err || !DSLInstance)
            {
              var response = {
                error: {
                  message: "Error: this DSL definition doesn't exists anymore"
                }
              };
              res.send(response);
            }
            else
            {
              next();
            }
          });
        }
        else
        {
          next();
        }
      }
    }
  }
};