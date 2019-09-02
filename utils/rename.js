#!/usr/bin/env node
var convert = require('xml-js');
var fs = require("fs");

const [, , ...args] = process.argv
const gameNameWithoutDash = args[0];
const gameNamewithDash = args[1];
const gameNameArgs = args.slice(2);
const Version = "1.0.0-SNAPSHOT";
let gameName = "";
gameNameArgs.forEach(arg => {
  gameName += arg + " ";
});


function updateClientPom() {
  fs.readFile("./pom.xml", function (error, data) {
    var json = JSON.parse((convert.xml2json(data, { compact: true, spaces: 4 }))),
      xml = data;

    // Update project Entried    
    json.project.groupId = "com.netent.casino-software.games.videoslots." + gameNamewithDash;
    json.project.artifactId = gameNameWithoutDash + "_mobile_html";
    json.project.name = gameName;
    json.project.version = Version;

    // Update Properties 
    json.project.properties["game-name"] = gameName;
    json.project.properties["langlib.groupId"] = "com.netent.casino-software.games.videoslots." + gameNamewithDash;
    json.project.properties["gamerules.groupId"] = "com.netent.casino-software.games.videoslots." + gameNamewithDash;
    json.project.properties["langlib.artifactId"] = gameNameWithoutDash + "-client-langlib";
    json.project.properties["gamerules.artifactId"] = gameNameWithoutDash + "-client-gamerules";

    // Update XML
    xml = convert.json2xml(json, { compact: true, ignoreComment: true, spaces: 4 })
    fs.writeFile("./pom.xml", xml, function (err) {
      if (err) return console.log(err);
    });
  });
}

function updateGameRulesPom() {

  fs.readFile("./pom.xml", function (error, data) {
    var json = JSON.parse((convert.xml2json(data, { compact: true, spaces: 4 }))),
      xml = data;

    // Update project Entried    
    json.project.groupId = "com.netent.casino-software.games.videoslots." + gameNamewithDash;
    json.project.artifactId = gameNameWithoutDash + "-gamerules";
    json.project.version = Version;

    // Update Properties 
    json.project.properties["im-2-git-link"] = gameNamewithDash;
    json.project.properties["langlib.version"] = Version;

    // update langlib Build
    for (i = 0; i < json.project.build.plugins.plugin.length; i++) {

      if (json.project.build.plugins.plugin[i].artifactId._text === "maven-dependency-plugin") {
        if (json.project.build.plugins.plugin[i].executions.execution.id._text === "unpack-langlib") {
          json.project.build.plugins.plugin[i].executions.execution.configuration.artifactItems.artifactItem.groupId = "com.netent.casino-software.games.videoslots." + gameNamewithDash;
          json.project.build.plugins.plugin[i].executions.execution.configuration.artifactItems.artifactItem.artifactId = gameNameWithoutDash + "-langlib";
        }

      }
    }

    // Update XML
    xml = convert.json2xml(json, { compact: true, ignoreComment: true, spaces: 4 })
    fs.writeFile("./pom.xml", xml, function (err) {
      if (err) return console.log(err);
    });
  });
}

function updateLanglibPom() {
  fs.readFile("./pom.xml", function (error, data) {
    var json = JSON.parse((convert.xml2json(data, { compact: true, spaces: 4 }))),
      xml = data;

    // Update project Entried    
    json.project.groupId = "com.netent.casino-software.games.videoslots." + gameNamewithDash;
    json.project.artifactId = gameNameWithoutDash + "-langlib";
    json.project.version = Version;

    // Update XML
    xml = convert.json2xml(json, { compact: true, ignoreComment: true, spaces: 4 })
    fs.writeFile("./pom.xml", xml, function (err) {
      if (err) return console.log(err);
    });
  });
}

function updateDistributionPom() {
  // pom.XML
  fs.readFile("./pom.xml", function (error, data) {
    var json = JSON.parse((convert.xml2json(data, { compact: true, spaces: 4 }))),
      xml = data;

    // Update project Entried    
    json.project.groupId = "com.netent.casino-software.games.videoslots." + gameNamewithDash;
    json.project.artifactId = gameNamewithDash + "-distribution";
    json.project.version = Version;

    // Update XML
    xml = convert.json2xml(json, { compact: true, ignoreComment: true, spaces: 4 })
    fs.writeFile("./pom.xml", xml, function (err) {
      if (err) return console.log(err);
    });
  });
}

function updateDistributionXML() {
  var oldFileName = "";
  // Find old distribution XML
  fs.readdir("./src/main/resources", function (err, files) {
    //handling error
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }
    oldFileName = files[0];
    //Rename to new xml
    fs.rename("./src/main/resources/" + oldFileName, "./src/main/resources/" + gameNamewithDash + "-distribution.xml", function (err) {
      if (err) console.log('ERROR: ' + err);
      fs.readFile("./src/main/resources/" + gameNamewithDash + "-distribution.xml", function (error, data) {
        var json = JSON.parse((convert.xml2json(data, { compact: true, spaces: 4 }))),
          xml = data;
  
  
        json.game._attributes["game-name"] = gameNamewithDash;
  
        //Variants Update
        for (var i = 0; i < (json.game.variants.variant.length); i++) {
          if (json.game.variants.variant[i]._attributes.variantName === "mobile") {
            json.game.variants.variant[i]._attributes.gameId = gameNameWithoutDash + "_mobile_html";
          }
          else if (json.game.variants.variant[i]._attributes.variantName === "desktop-html5") {
            json.game.variants.variant[i]._attributes.gameId = gameNameWithoutDash + "_not_mobile";
          }
          else if (json.game.variants.variant[i]._attributes.variantName === "desktop-openbet-html5") {
            json.game.variants.variant[i]._attributes.gameId = "netent_" + gameNameWithoutDash + "_not_mobile";
          }
          else if (json.game.variants.variant[i]._attributes.variantName === "mobile-openbet") {
            json.game.variants.variant[i]._attributes.gameId = "netent_" + gameNameWithoutDash + "_mobile_html";
          }
        }
  
        //clients update
        if (json.game.clients.client._attributes.clientType === "generic") {
          json.game.clients.client.artifact._attributes.artifactId = gameNameWithoutDash + "_mobile_html";
          json.game.clients.client.artifact._attributes.version = Version;
          json.game.clients.client.installation._attributes.linkPath = "games/" + gameNameWithoutDash + "_mobile_html";
  
        }
  
        //Server Update
        if (json.game.servers.server._attributes.serverType === "geeBundle") {
          json.game.servers.server.artifact._attributes.artifactId = gameNamewithDash;
          json.game.servers.server.artifact._attributes.version = Version;
        }
  
        // configuration update
        for (var i = 0; i < (json.game.configurations.configuration.length); i++) {
          if (json.game.configurations.configuration[i]._attributes.configType == "not_mobile") {
            json.game.configurations.configuration[i].artifact._attributes.artifactId = gameNameWithoutDash + "_not_mobile-config";
            json.game.configurations.configuration[i].artifact._attributes.version = Version;
          }
          else if (json.game.configurations.configuration[i]._attributes.configType == "mobile") {
            json.game.configurations.configuration[i].artifact._attributes.artifactId = gameNameWithoutDash + "_mobile_html-config";
            json.game.configurations.configuration[i].artifact._attributes.version = Version;
          }
        }
  
  
        // Update XML
        xml = convert.json2xml(json, { compact: true, ignoreComment: true, spaces: 4 })
        fs.writeFile("./src/main/resources/" + gameNamewithDash + "-distribution.xml", xml, function (err) {
          if (err) return console.log(err);
        });
      });
    });
    
  });
}

function updateClient() {
  updateClientPom();
}

function updateConfigDesktop() {

}

function updateConfigMobile() {

}

function updateDistribution() {
  updateDistributionPom();
  updateDistributionXML();
}

function updateGamerules() {
  updateGameRulesPom();
}

function updateLanglib() {
  updateLanglibPom();
}

function updateFiles() {
  var currentDirectory = process.cwd(), reponame = "";
  if (currentDirectory.indexOf('/') !== -1)
    currentDirectory = currentDirectory.substring(currentDirectory.lastIndexOf('/') + 1);
  else
    currentDirectory = currentDirectory.substring(currentDirectory.lastIndexOf('\\') + 1);

  reponame = currentDirectory.split("-").pop();
  switch (reponame) {
    case 'server': updateServer();
      break;

    case 'desktop': updateConfigDesktop();
      break;

    case 'mobile': updateConfigMobile();
      break;

    case 'generic': updateClient();
      break;

    case 'distribution': updateDistribution();
      break;

    case 'gamerules': updateGamerules();
      break;

    case 'langlib': updateLanglib();
      break;

    default: break;

  }

}


updateFiles();