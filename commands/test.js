function test(args) {
  var fs = require("fs");
  var path = require("path");
  var api = require("../api");
  var Mocha = require("mocha");
  var mongoose = require("mongoose");
  var mocha = new Mocha;

  for (name in api) {
    var filePath = path.join(__rootDir, "api", name, "_tests.js");
    if (fs.existsSync(filePath)) {
      mocha.addFile(filePath);
    }
  }

  var conn = mongoose.connection;

  conn.on("error", function(err) {
    console.log("Error connection to MongoDB:", err);
  });

  conn.once("open", function() {
    console.log("Connected to MongoDB !");
    mocha.run(function(failures) {
      conn.db.dropDatabase(function() {
        mongoose.disconnect();  
      });
      process.on('exit', function () {
        process.exit(failures);
      });
    });
  });

  console.log("Connecting to MongoDB...");
  mongoose.connect("mongodb://127.0.0.1/nourriture_test");
}

module.exports = {
  fn: test,
  desc: "Launch tests"
};
