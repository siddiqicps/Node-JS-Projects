// var Connection = require('tedious').Connection;
// var Request = require('tedious').Request;
// var TYPES = require('tedious').TYPES;

// // Create connection to database
// var config = {
//   server: 'localhost',
//   authentication: {
//       type: 'default',
//       options: {
//           userName: 'sa', // update me
//           password: 'P@$$w0rd' // update me
//       }
//   },
//   options: {
//       database: 'TestNotify'
//   }
// }
// var connection = new Connection(config);

// // Attempt to connect and execute queries if connection goes through
// connection.on('connect', function(err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('Connected');
//   }
// });

const sql = require('mssql')
const sqlConfig = {
  user: 'sa',
  password: 'P@$$w0rd',
  database: 'TestNotify',
  server: 'DESKTOP-PS1VHBJ\\MSSQLSERVER,1433',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: false // change to true for local dev / self-signed certs
  }
}

async () => {
 try {
  // make sure that any items are correctly URL encoded in the connection string
  await sql.connect(sqlConfig)
  const result = await sql.query`select * from mytable where id = ${value}`
  console.dir(result)
 } catch (err) {
  // ... error checks
  console.log(err)
 }
}