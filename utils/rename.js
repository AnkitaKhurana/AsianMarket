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

    // Update Properties 
    json.project.properties["im-2-git-link"] = gameNamewithDash;
    json.project.properties["langlib.version"] = Version;

    // update langlib Build
    for (i = 0; i < json.project.build.plugins.plugin.length; i++) {
      if (json.project.build.plugins.plugin[i].artifactId === "maven-dependency-plugin") {
        for (j = 0; i < json.project.build.plugins.plugin[i].executions.execution.length; i++) {
          if (json.project.build.plugins.plugin[i].executions.execution[j] === "unpack-langlib") {
            json.project.build.plugins.plugin[i].executions.execution[j].configuration.artifactItems.artifactItem.groupId = "com.netent.casino-software.games.videoslots." + gameNamewithDash;
            json.project.build.plugins.plugin[i].executions.execution[j].configuration.artifactItems.artifactItem.artifactId = gameNameWithoutDash + "-langlib";
          }
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

function updateClient() {
  updateClientPom();
}

function updateConfigDesktop() {

}

function updateConfigMobile() {

}

function updateDistribution() {

}

function updateGamerules() {
  updateGameRulesPom();
}

function updateLanglib() {

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