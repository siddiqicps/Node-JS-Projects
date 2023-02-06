const https = require("https");

class AuthController{
    constructor(path, method){
        this.options = {
            hostname: 'dummyjson.com',
            method: method,
            path: path,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }

    login(payload){
        return new Promise((resolve, reject) => {
            console.log("Inside Auth Controller Login Method. ",payload)
            let data = '';
            if(payload){
                this.options.headers["Content-Length"] = Buffer.byteLength(payload)
            }
            console.log(this.options)
            const request = https.request(this.options, (response) => {
                response.setEncoding('utf-8');

                response.on('data', (chunk) => {
                    data += chunk
                })

                response.on('end', () => {
                    console.log("End reading data")
                    resolve(data)
                })
            })

            request.on('error', (err) => {
                console.error("Errro occured while fetching the data")
                reject(err)
            })

            request.write(payload);

            request.end()
        })
    }
}

module.exports = AuthController