const https = require("https");

class ProductsController{
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

    getAllProducts(){
        // const products = await fetch('https://dummyjson.com/products')
        // // .then(res => res.json())
        // // .then(json => console.log(json))
        // return products.json()
        return new Promise((resolve, reject) => {
            let data = '';
            let request = https.request(this.options,(response) => {
                response.setEncoding('utf-8');

                response.on('data', (chunk) => {
                    data += chunk
                })

                response.on('end', () => {
                    console.log('Data Receiving End')
                    resolve(data)
                })
            })

            request.on('error', (error) => {
                console.error(error)
                reject(error)
            })

            request.end()
        });
    }
}

module.exports = ProductsController