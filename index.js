const http = require("http");
const fs = require("fs");
const {products} = require("./db");

const server = http.createServer(handleRequest);

server.listen(3000, () => console.log("Server started at http://localhost:3000"));

function handleRequest(request, response){
  let url = request.url;

  if (url.startsWith("/api/")) handleAPI(request, response)
  else {
    try {
      if (url === "/") url = "/index.htm"
      response.end(fs.readFileSync("public" + url))
    } catch (err) {
        response.end("404 file not found " + url)
    }
  }
}

function handleAPI(request, response){
  let route = request.url.slice(5);

  if (route === "products"){
    response.end(JSON.stringify(products))
  } 
}




