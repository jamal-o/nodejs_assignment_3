const { createServer } = require("http");
const fs = require("fs");
const url = require("url");

const dbFileName = "jokes.json";
function getHandler(req, res) {
    //return all jokes to user

    let db = fs.readFileSync(dbFileName, {"encoding": "utf-8"});
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

function deleteJoke(id) {
    let db = fs.readFileSync(dbFileName, {"encoding": "utf-8"});
    let jokes = JSON.parse(db);

    if (jokes[id] !== undefined) {
        let deletedJoke = jokes[id];
        console.log("jokes: " + jokes.toString());
        jokes.splice(id,1);
        console.log("jokes: " + jokes.toString());

        fs.writeFile(dbFileName, JSON.stringify(jokes), (err)=>{});

        return JSON.stringify(deletedJoke);
    }else{

    }

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

  //handle joke route
  if (req.url.match(/\/joke\/\d/ )) {
    if (req.method == "DELETE") {
        let pathName = url.parse(req.url,true).pathname;
        let id = pathName.split("/")[2];
        
        let deletedJoke = deleteJoke(id);
        res.end(deletedJoke);
    }
  }
}

const server = createServer(requestHandler);
server.listen(3000, () => {
  console.log("Server up and running!");
});
