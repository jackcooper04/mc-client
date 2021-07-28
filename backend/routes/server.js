//Import Packages
const express = require('express');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const Rcon = require('modern-rcon');
const homedir = require('os').homedir();
const { exec } = require("child_process");

//Import Files

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
console.log(path.join(homedir,'Documents','MC_Server_Files','server'))
//Directory Checks
if (!fs.existsSync(path.join(homedir,'Documents','MC_Server_Files'))){
  fs.mkdirSync(path.join(homedir,'Documents','MC_Server_Files'))
};
if (!fs.existsSync(path.join(homedir,'Documents','MC_Server_Files','configs'))){
  fs.mkdirSync(path.join(homedir,'Documents','MC_Server_Files','configs'))
};
if (!fs.existsSync(path.join(homedir,'Documents','MC_Server_Files','server'))) {
  fs.mkdirSync(path.join(homedir,'Documents','MC_Server_Files','server'));

  fs.writeFileSync(path.join(homedir,'Documents','MC_Server_Files','server','eula.txt'), '');
  fs.writeFileSync(path.join(homedir,'Documents','MC_Server_Files','server','eula.txt'), 'eula=true');
  console.log('Server DIR Not Found Creating')
};
if (!fs.existsSync(path.join(homedir,'Documents','MC_Server_Files','server_files'))) {
  fs.mkdirSync(path.join(homedir,'Documents','MC_Server_Files','server_files'))
  console.log('Server Files DIR Not Found Creating')
};
if (!fs.existsSync(path.join(homedir,'Documents','MC_Server_Files','configs','server.json'))){
  fs.writeFileSync(path.join(homedir,'Documents','MC_Server_Files','configs','server.json'), '[]');
}
console.log('DIR Checks Complete');
const savedServers = require(path.join(homedir,'Documents','MC_Server_Files','configs','server.json'));
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
  fs.writeFile(path.resolve(homedir,'Documents','MC_Server_Files','configs','server.json'), temp, function (err) {
    // If an error occurred, show it and return
    if (err) return console.error(err);
    // Successfully wrote to the file!
  });
}
async function downloadServer(file, name) {
  const url = file
  const filePath = path.resolve(homedir,'Documents','MC_Server_Files','server_files', name + '.jar')
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
      fs.writeFileSync(path.join((homedir,'Documents','MC_Server_Files','server','server.properties')), data);
      fs.copyFile(path.join(homedir,'Documents','MC_Server_Files','server_files', selectedServer.version + '.jar'), path.join(homedir,'Documents','MC_Server_Files','server','server.jar'), (err) => {
        if (err) throw err;
        if (req.query.window == "true"){
          exec(`start cmd.exe /k "cd `+path.join(homedir,'Documents','MC_Server_Files','server')+` && java -Xmx1024M -Xms1024M -jar server.jar nogui && exit"`, (error, stdout, stderr) => {
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
          exec("cd "+path.join(homedir,'Documents','MC_Server_Files','server')+" && java -Xmx1024M -Xms1024M -jar server.jar nogui", (error, stdout, stderr) => {
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
  fs.readdir(path.resolve(homedir,'Documents','MC_Server_Files','server_files'), (err, files) => {
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
  var selectedVersion = req.body.version;
  if (selectedVersion == "latest_release") {
    selectedVersion = versions.latest.release;
  } else if (selectedVersion == "latest_snapshot") {
    selectedVersion = versions.latest.snapshot;
  };
  var newServer = {
    name: req.body.name,
    version: selectedVersion,
    gamemode: req.body.gamemode,
    difficulty: req.body.difficulty,
    whitelist:req.body.whitelist,
    max:req.body.max
  };
  savedServers.push(newServer);
  updateServers();
  res.send(newServer)
})
getVerions();
//Export Routes
module.exports = router;
