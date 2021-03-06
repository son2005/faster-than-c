var mysql = require('mysql');

exports.connect = function(options, cb) {
  var connection = mysql.createClient(options);

  // force an implicit connection to be established
  connection.query('SELECT 1', function(err) {
    cb(err, connection);
  });
};

exports.query = function(connection, sql, cb) {
  var query = connection.query(sql);
  var rows = 0;

  var byteOffset = connection._socket.bytesRead;

  query
    .on('row', function(row) {
      rows++;
    })
    .on('end', function() {
      var bytes = connection._socket.bytesRead - byteOffset;
      cb(null, rows, bytes)
    });
};
