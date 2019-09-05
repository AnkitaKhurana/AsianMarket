#!/usr/bin/env node
var convert = require('xml-js');
var PropertiesReader = require('properties-reader');
var fs = require("fs");

const [, , ...args] = process.argv
const gameNameWithoutDash = args[0];
const gameNamewithDash = args[1];
const gameNameArgs = args.slice(2);
const Version = "1.0.0-SNAPSHOT";
const desktop = 'desktop';
const mobile = 'mobile';

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


function updateConfigPOM(variant) {
  fs.readFile("./pom.xml", function (error, data) {
    var json = JSON.parse((convert.xml2json(data, { compact: true, spaces: 4 }))),
      xml = data;

    // Update project Entried
    json.project.groupId = "com.netent.casino-software.games.videoslots." + gameNamewithDash + ".configuration";
    json.project.artifactId = gameNameWithoutDash + (variant === desktop ? "_not_mobile-config" : "_mobile_html-config");
    json.project.version = Version;
    json.project.name = "Game Configuration for " + gameNameWithoutDash;
    // Update XML
    xml = convert.json2xml(json, { compact: true, ignoreComment: true, spaces: 4 })
    fs.writeFile("./pom.xml", xml, function (err) {
      if (err) return console.log(err);
    });
  });
}

function updateConfigGameCategoryConfig(variant) {
  fs.readFile("./GameCategoryGroupConfiguration.xml", function (error, data) {
    var json = JSON.parse((convert.xml2json(data, { compact: true, spaces: 4 }))),
      xml = data;

    // Update project Entried
    json.gameCategoryGroupConfiguration._attributes.gameId = gameNameWithoutDash + (variant === desktop ? "_not_mobile" : "_mobile_html");
    // Update XML
    xml = convert.json2xml(json, { compact: true, ignoreComment: true, spaces: 4 })
    fs.writeFile("./GameCategoryGroupConfiguration.xml", xml, function (err) {
      if (err) return console.log(err);
    });
  });
}


function updateConfigGameConfig(variant) {
  fs.readFile("./GameCategoryGroupConfiguration.xml", function (error, data) {
    var json = JSON.parse((convert.xml2json(data, { compact: true, spaces: 4 }))),
      xml = data;

    // Update project Entried
    json.gameCategoryGroupConfiguration._attributes.gameId = gameNameWithoutDash + (variant === desktop ? "_not_mobile" : "_mobile_html");
    // Update XML
    xml = convert.json2xml(json, { compact: true, ignoreComment: true, spaces: 4 })
    fs.writeFile("./GameCategoryGroupConfiguration.xml", xml, function (err) {
      if (err) return console.log(err);
    });
  });
}

function updateConfigGameProperties(variant) {
  var properties = PropertiesReader('./game.properties');

  properties.set('gameid', gameNameWithoutDash + (variant === desktop ? "_not_mobile" : "_mobile_html"));
  properties.set('game.binaryFileName', gameNameWithoutDash + "_mobile_html.xhtml");
  properties.set('game.name', gameName);
  properties.set('game.fullname', gameName);
  properties.set('game.gameServerIdentifier', gameNameWithoutDash);
  properties.save('./game.properties', function then(err, data) { if (err) console.log(err) });

}

function updateConfigFreeroundConfiguartionParameters(variant) {
  fs.readFile("./FreeroundConfigurationParameters.xml", function (error, data) {
    var json = JSON.parse((convert.xml2json(data, { compact: true, spaces: 4 }))),
      xml = data;

    // Update project Entried
    json.freeroundConfigurationParameters._attributes.gameId = gameNameWithoutDash + (variant === desktop ? "_not_mobile" : "_mobile_html");

    // Update XML
    xml = convert.json2xml(json, { compact: true, ignoreComment: true, spaces: 4 })
    fs.writeFile("./FreeroundConfigurationParameters.xml", xml, function (err) {
      if (err) return console.log(err);
    });
  });
}

function updateConfigGameConfiguration(variant) {
  fs.readFile("./GameConfiguration.xml", function (error, data) {
    var json = JSON.parse((convert.xml2json(data, { compact: true, spaces: 4 }))),
      xml = data;

    // Update project Entried
    json.gameConfiguration._attributes.gameId = gameNameWithoutDash + (variant === desktop ? "_not_mobile" : "_mobile_html");
    json.gameConfiguration._attributes.id = gameNameWithoutDash + (variant === desktop ? "_not_mobile" : "_mobile_html");
    json.gameConfiguration.name = gameName + (variant === desktop ? "" : " Touch");
    json.gameConfiguration.fullname = gameName + (variant === desktop ? "" : " Touch");
    json.gameConfiguration.gameServerIdentifier = gameNameWithoutDash;
    json.gameConfiguration.binaryFileName = gameNameWithoutDash + "_mobile_html.xhtml";

    // Update XML
    xml = convert.json2xml(json, { compact: true, ignoreComment: true, spaces: 4 })
    fs.writeFile("./GameConfiguration.xml", xml, function (err) {
      if (err) return console.log(err);
    });
  });
}


function updateConfigGameConfigurationParameters(variant) {
  fs.readFile("./GameConfigurationParameters.xml", function (error, data) {
    var json = JSON.parse((convert.xml2json(data, { compact: true, spaces: 4 }))),
      xml = data;

    // Update project Entried
    json.gameConfigurationParameters._attributes.gameId = gameNameWithoutDash + (variant === desktop ? "_not_mobile" : "_mobile_html");

    // Update XML
    xml = convert.json2xml(json, { compact: true, ignoreComment: true, spaces: 4 })
    fs.writeFile("./GameConfigurationParameters.xml", xml, function (err) {
      if (err) return console.log(err);
    });
  });
}

function updateClient() {
  updateClientPom();
}

function updateConfigDesktop() {
  updateConfigPOM(desktop);
  updateConfigGameCategoryConfig(desktop);
  updateConfigFreeroundConfiguartionParameters(desktop);
  //updateConfigGameProperties(desktop)
  updateConfigGameConfiguration(desktop);
  updateConfigGameConfigurationParameters(desktop);

}

function updateConfigMobile() {
  updateConfigPOM(mobile);
  updateConfigGameCategoryConfig(mobile);
  updateConfigFreeroundConfiguartionParameters(mobile);
  //updateConfigGameProperties(mobile)
  updateConfigGameConfiguration(mobile);
  updateConfigGameConfigurationParameters(mobile);
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

    case 'client': updateClient();        // Games like double-up-client
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
