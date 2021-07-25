//Import Packages
const express = require('express');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const Rcon = require('modern-rcon');
const { exec } = require("child_process");

//Import Files
const savedServers = require('../servers.json');
var serverProperties = ''
fs.readFile(path.join(__dirname, '../templates/server.properties'), 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return
  };
  serverProperties = data;
  //console.log(data);
});
//Initalise Packages
const router = express.Router();
const rcon = new Rcon('localhost','**58powerTHINKheight42**');

//Directory Checks
if (!fs.existsSync(path.join(__dirname, '../../server'))) {
  fs.mkdirSync(path.join(__dirname, '../../server'));

  fs.writeFileSync(path.join(__dirname, '../../server/eula.txt'), '');
  fs.writeFileSync(path.join(__dirname, '../../server/eula.txt'), 'eula=true');
  console.log('Server DIR Not Found Creating')
};
if (!fs.existsSync(path.join(__dirname, '../../server_files'))) {
  fs.mkdirSync(path.join(__dirname, '../../server_files'))
  console.log('Server Files DIR Not Found Creating')
};
console.log('DIR Checks Complete');

//Global Variables
var versions = {};
//Functions

function sendCommand(command){
  rcon.connect().then(() => {
    return rcon.send(command); // That's a command for Minecraft
  }).then(res => {
    //console.log(res);
  }).then(() => {
    return rcon.disconnect();
  });
};

function getVerions() {
  var config = {
    method: 'get',
    url: 'https://launchermeta.mojang.com/mc/game/version_manifest_v2.json',
    headers: {}
  };
  axios(config)
    .then(function (response) {
      versions = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
};
function updateServers() {
  var temp = JSON.stringify(savedServers)
  fs.writeFile(path.resolve(__dirname, '../servers.json'), temp, function (err) {
    // If an error occurred, show it and return
    if (err) return console.error(err);
    // Successfully wrote to the file!
  });
}
async function downloadServer(file, name) {
  const url = file
  const filePath = path.resolve(__dirname, '../../server_files', name + '.jar')
  const writer = fs.createWriteStream(filePath)

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}


//Routes
router.get("", (req, res, next) => {
  res.json({ servers: savedServers });
});
router.get("/rcon/:command", (req,res,next) => {
  sendCommand(req.params['command']);
  res.json({message:'OK'});
})
router.get("/trigger/:name", (req, res, next) => {
  for (serverIdx in savedServers) {
    if (savedServers[serverIdx].name == req.params['name']) {
      var selectedServer = savedServers[serverIdx];
      var data = serverProperties;
      data +=
        `level-name=` + selectedServer.name + `\nmotd=`+ selectedServer.name + `\nwhite-list=`+ selectedServer.whitelist + `\nmax-players=`+ selectedServer.max + `\ngamemode=`+ selectedServer.gamemode + `\ndifficulty=`+ selectedServer.difficulty
      fs.writeFileSync(path.join(__dirname, '../../server/server.properties'), data);
      fs.copyFile(path.join(__dirname, '../../server_files', selectedServer.version + '.jar'), path.join(__dirname, '../../server/server.jar'), (err) => {
        if (err) throw err;
        if (req.query.window == "true"){
          exec(`start cmd.exe /k "cd `+path.join(__dirname, '../../server')+` && java -Xmx1024M -Xms1024M -jar server.jar nogui && exit"`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
        } else {
          exec("cd "+path.join(__dirname, '../../server')+" && java -Xmx1024M -Xms1024M -jar server.jar nogui", (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
        }

      });

      res.json({message:'OK'})
    }
  }
});
router.get("/source/:version", (req, res, next) => {

  var selectedVersion = req.params['version'];
  if (selectedVersion == "latest_release") {
    selectedVersion = versions.latest.release;
  } else if (selectedVersion == "latest_snapshot") {
    selectedVersion = versions.latest.snapshot;
  };
  fs.readdir(path.resolve(__dirname, '../../server_files'), (err, files) => {
    if (files.includes(selectedVersion + '.jar')) {
      res.json({ message: 'OK', download: false });
    } else {
      var storedVersions = versions.versions;
      for (versionIdx in storedVersions) {
        if (storedVersions[versionIdx].id == selectedVersion) {
          var serverUrl = storedVersions[versionIdx].url;
          var config = {
            method: 'get',
            url: serverUrl,
            headers: {}
          };
          axios(config)
            .then(function (response) {
              downloadServer(response.data.downloads.server.url, selectedVersion)
              res.json({ message: 'OK', download: true })
            });
        };
      };
    };

    //console.log(files)
  });

});
//version
router.post("/", (req, res, next) => {
  var newServer = {
    name: req.body.name,
    version: req.body.version,
    gamemode: req.body.gamemode,
    difficulty: req.body.difficulty,

  };
  savedServers.push(newServer);
  updateServers();
  res.send(newServer)
})
getVerions();
//Export Routes
module.exports = router;
