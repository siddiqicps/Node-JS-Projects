const ProductsController = require("./ProductsController")
const AuthController = require("./AuthController")
module.exports = async function getRoutes(req,res){
    let data = 'No Data'
    res.writeHead(200,{"Content-Type": "application/json"})
    if(req.method === "GET"){
        if(req.url === "/api/Products"){
            const products = new ProductsController('/product', 'GET')
            data = await products.getAllProducts()
        }
    }
    if(req.method === "POST"){
        if(req.url === "/api/auth"){
            console.log("Inside /api/auth")
            const auth = new AuthController('/auth/login', 'POST')
            const postData = JSON.stringify({
                "username": "kminchelle",
                "password": "0lelplR"
              })
            data = await auth.login(postData)
        }
    }
    

    res.end(data)
}