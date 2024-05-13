const { createServer } = require("http");
const fs = require("fs");
const url = require("url");


function getHandler(req, res) {
    //return all jokes to user

    let db = fs.readFileSync("jokes.json", {"encoding": "utf-8"});
    res.writeHead(200);
    res.end(db);
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


    //handle home route
  if (req.url === "/") {
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
}

const server = createServer(requestHandler);
server.listen(3000, () => {
  console.log("Server up and running!");
});
