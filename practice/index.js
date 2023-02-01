var http = require('http');
const getRoutes = require("./routes")

var server = http.createServer(async (req,res) => {
    // res.writeHead(200,{"Content-Type": "application/json"});
    // res.write("Test API with Vanilla Node.js");
    // res.end();
    getRoutes(req,res)
})

server.listen(5000, () => {
    console.log("Application listening on port number 5000")
})