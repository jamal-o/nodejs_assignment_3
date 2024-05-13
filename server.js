const { createServer } = require("http");
const fs = require("fs");
const url = require("url");

function responseToJson(response) {
  return JSON.stringify(JSON.parse(response));
}


function getHandler(req, res) {

}

function postHandler(req, res) {
  let data = "";
  req.on("data", (chunk) => {
    data = data.concat(chunk);
  });

  req.on("end", () => {
    let requestBody = JSON.parse(data);
   


  });
}

function requestHandler(req, res) {
  res.setHeader("Content-type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  switch (req.method) {
    case "GET":
      getHandler(req, res);
      break;

    case "POST":      
      postHandler(req, res);
      break;

    default:
      res.writeHead(404, { "Content-type": "application/json" });
      res.end(
        JSON.stringify(
          `
                "error": 
                {
                    "statusCode": 404
                    "message": "Http method not supported"
                }
                `
        )
      );
      break;
  }
}

const server = createServer(requestHandler);
server.listen(3000, () => {
  console.log("Server up and running!");
});

