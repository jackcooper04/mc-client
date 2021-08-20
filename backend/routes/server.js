//Import Packages
const express = require('express');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const Gamedig = require('gamedig');
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
var isDownloading = false;
var status =  {
  "online":false,
  "motd":'',
  "players":[],
  "version":"",
  "max":""

}
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
      updateServerFiles();
    })
    .catch(function (error) {
      console.log(error);
    });
};
function getStatus(){
  Gamedig.query({
    type: 'minecraft',
    host: 'localhost'
}).then((state) => {

  status.online = true;
  status.max  = state.raw.vanilla.maxplayers
  status.motd = state.name;
  status.version = state.raw.vanilla.raw.version.name;
  status.players = state.raw.vanilla.raw.players.sample;
  if (status.players == undefined){
    status.players = [];
  }


}).catch((error) => {
  status.online = false;
  status.motd = '';
  status.players = [];
  status.max = "";


});
};
getStatus();
setInterval(function(){ getStatus(); }, 2000);
function updateServers() {
  var temp = JSON.stringify(savedServers)
  fs.writeFile(path.resolve(homedir,'Documents','MC_Server_Files','configs','server.json'), temp, function (err) {
    // If an error occurred, show it and return
    if (err) return console.error(err);
    // Successfully wrote to the file!
  });
};

function updateServerFiles(){
  var checkArray = new Array();
  for (serverIdx in savedServers){
   var selectedVersion = savedServers[serverIdx].version;

    if (savedServers[serverIdx].version == "latest_release") {
     var selectedVersion = versions.latest.release;
    } else if (savedServers[serverIdx].version == "latest_snapshot") {
     var selectedVersion = versions.latest.snapshot;
    };

    checkVersions(selectedVersion);

  };


};
var queue = new Array();

async function checkVersions(selected_version){
  fs.readdir(path.resolve(homedir,'Documents','MC_Server_Files','server_files'), (err, files) => {
    if (files.includes(selected_version + '.jar')) {
      //console.log('Confirm' + selectedVersion)
    } else {
      var storedVersions = versions.versions;

      for (versionIdx in storedVersions) {

        if (storedVersions[versionIdx].id == selected_version) {

          var serverUrl = storedVersions[versionIdx].url;


          var config = {
            method: 'get',
            url: serverUrl,
            headers: {}
          };
          axios(config)
            .then(function (response) {
              console.log(response.data.downloads.server.url);
              console.log(selected_version)
              downloadServer(response.data.downloads.server.url, selected_version, response.data.downloads.server.size)
              console.log('Missing Downloading')
            });
        };
      };
    };

    //console.log(files)
  });
}

async function downloadServer(file, name, size) {

  const url = file
  const filePath = path.resolve(homedir,'Documents','MC_Server_Files','server_files', name + '.jar')
  const writer = fs.createWriteStream(filePath)

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })

  response.data.pipe(writer)
  console.log(size)
  var checkForProgress = setInterval(function(){
   var file = fs.statSync(filePath);
   if (file.size == size){
     clearInterval(checkForProgress);
     //console.log('done')
     isDownloading = false;
     return;
   };
   isDownloading = true;
    //console.log(Math.round((file.size / size) * 100))
 }, 10);



  return new Promise((resolve, reject) => {
    //writer.on('finish',clearTimeout(checkForProgress))
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

//
//
//Routes
router.get("", (req, res, next) => {
  res.json({ servers: savedServers });
});
router.get("/status", (req,res,next) => {
  res.json({status:status})
});
router.get("/banned",(req,res,next) => {
  fs.readFile(path.join(homedir,'Documents','MC_Server_Files','server','banned-players.json'), 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    data = JSON.parse(data)
    res.json({banned:data})
  })




})
router.get("/versionList",(req,res,next) => {
  serverList = new Array();
  for (serverIdx in versions.versions){
    if (req.query.snapshot == "false"){
      if (!versions.versions[serverIdx].id.includes('w') && !versions.versions[serverIdx].id.includes('-') && !versions.versions[serverIdx].id.includes('pre') && !versions.versions[serverIdx].id.includes('Pre') && !versions.versions[serverIdx].id.includes('a') && !versions.versions[serverIdx].id.includes('b') && !versions.versions[serverIdx].id.includes('c')){

        serverList.push(versions.versions[serverIdx].id);
      } else {
       // serverList.push(versions.versions[serverIdx].id);
      }
    }

    if (req.query.snapshot == undefined || req.query.snapshot == "true") {
      serverList.push(versions.versions[serverIdx].id);
    }



  }
  res.json({versions:serverList})
})
router.get("/isDownload", (req,res,next) => {
  res.json({isDownloading:isDownloading});
})
router.get("/rcon/:command", (req,res,next) => {
  sendCommand(req.params['command']);
  res.json({message:'OK'});
})
router.get("/trigger/:name", (req, res, next) => {
  for (serverIdx in savedServers) {
    if (savedServers[serverIdx].name == req.params['name']) {

      var selectedServer = savedServers[serverIdx];
      if (selectedServer.version == "latest_release") {
        selectedServer.version = versions.latest.release;
      } else if (selectedServer.version == "latest_snapshot") {
        selectedServer.version = versions.latest.snapshot;
      };
      var data = serverProperties;
      data +=
        `level-name=` + selectedServer.name + `\nmotd=`+ selectedServer.name + `\nwhite-list=`+ selectedServer.whitelist + `\nmax-players=`+ selectedServer.max + `\ngamemode=`+ selectedServer.gamemode + `\ndifficulty=`+ selectedServer.difficulty
      fs.writeFileSync(path.join(homedir,'Documents','MC_Server_Files','server','server.properties'), data);
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
              downloadServer(response.data.downloads.server.url, selectedVersion, response.data.downloads.server.size)
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
 /*  if (selectedVersion == "latest_release") {
    selectedVersion = versions.latest.release;
  } else if (selectedVersion == "latest_snapshot") {
    selectedVersion = versions.latest.snapshot;
  }; */
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
