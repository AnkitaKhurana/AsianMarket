#!/usr/bin/env node
var convert = require('xml-js');
var fs = require("fs");

const[,,...args] = process.argv
const gameNameWithoutDash = args[0];
const gameNamewithDash = args[1];
const gameNameArgs = args.slice(2);
let gameName = "";
gameNameArgs.forEach(arg => {
    gameName+= arg+" ";
});

function updatePom(){

    fs.readFile("./pom.xml", function(error, data) {
      var json = JSON.parse((convert.xml2json(data, {compact: true, spaces: 4}))),
          xml = data;
      json.project.groupId = "com.netent.casino-software.games.videoslots." + gameNamewithDash;
      json.project.artifactId = gameNameWithoutDash+"_mobile_html";
      json.project.name = gameName;


      // Update XML
      xml = convert.json2xml(json,{compact: true, ignoreComment: true, spaces: 4})
      fs.writeFile("./pom.xml", xml, function (err) {
        if (err) return console.log(err);
     });
   });

}

updatePom();