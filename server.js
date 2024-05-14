const { createServer } = require("http");
const fs = require("fs");
const url = require("url");

const dbFileName = "jokes.json";
function getHandler(req, res) {
  //return all jokes to user

  let db = fs.readFileSync(dbFileName, { encoding: "utf-8" });
  res.writeHead(200);
  res.end(db);
}

function postHandler(req, res) {
  let db = fs.readFileSync(dbFileName, { encoding: "utf-8" });
  jokes = JSON.parse(db);

  let data = "";
  req.on("data", (chunk) => {
    data = data.concat(chunk);
  });

  req.on("end", () => {
    let newJoke = JSON.parse(data);
    jokes.push(newJoke);

    fs.writeFile(dbFileName, JSON.stringify(jokes), (err) => {});

    res.end(JSON.stringify(jokes));
  });
}

function deleteJoke(id) {
  let db = fs.readFileSync(dbFileName, { encoding: "utf-8" });
  let jokes = JSON.parse(db);

  if (jokes[id] !== undefined) {
    let deletedJoke = jokes[id];
    console.log("jokes: " + JSON.stringify(jokes) + "\n\n\n");
    jokes.splice(id, 1);
    console.log("jokes: " + JSON.stringify(jokes));

    fs.writeFile(dbFileName, JSON.stringify(jokes), (err) => {});

    return JSON.stringify(deletedJoke);
  } else {
    return "invalid_joke";
  }
}

function updateJoke(id, req, res) {
  let db = fs.readFileSync(dbFileName, { encoding: "utf-8" });
  let jokes = JSON.parse(db);
  console.log(db + "54\n\n");
  let newJoke;

  //   const getData = new Promise((resolve)=>{
  //     resolve(
  //   });

  let data = "";
  req.on("data", (chunk) => {
    data = data.concat(chunk);
  });

  req.on("end", () => {
    newJoke = JSON.parse(data);
    console.log(JSON.stringify(newJoke) + " 68\n\n");

    if (jokes[id] !== undefined) {
        console.log(JSON.stringify(jokes[id]) + " 71\n\n");
        res.end(JSON.stringify(jokes[id]));

       jokes[id] = newJoke;

      console.log(JSON.stringify(jokes) + "76\n\n");

      fs.writeFile(dbFileName, JSON.stringify(jokes), (err) => {});
      
    } else {
        res.setHeader("StatusCode", 300);
        res.end(`{"message": "there is no joke with that ID"}`);
      } 
    
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

  //handle joke route
  if (req.url.match(/\/joke\/\d/)) {
    let pathName = url.parse(req.url, true).pathname;
    let id = pathName.split("/")[2];
    if (req.method == "DELETE") {
      let deletedJoke = deleteJoke(id);

      if (deletedJoke === "invalid_joke") {
        res.setHeader("StatusCode", 300);
        res.end(`{"message": "there is no joke with that ID"}`);
      } else {
        res.setHeader("StatusCode", "400");
        res.end(deletedJoke);
      }
    }

    if (req.method == "PATCH") {
      let updatedJoke = updateJoke(id, req, res);
      //   res.end(updatedJoke);
    }
  }
}

const server = createServer(requestHandler);
server.listen(3000, () => {
  console.log("Server up and running!");
});
