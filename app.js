#!/usr/bin/env node
"use strict";

const fs = require("fs");
const program = require("commander");
const handlebars = require("handlebars");
const handlebarsHelpers = require('handlebars-helpers')();
const he = require('he');
handlebars.registerHelper(handlebarsHelpers);

handlebars.registerHelper('find', function (array, property, value) {
  return array.find(function (item) {
    return item[property] === value;
  });
});

function runApp(args) {
  try {
    program
      .option("-j, --json <json>", "input JSON file")
      .option("-t, --template <template>", "input Handlebars template file")
      .option("-n, --root-node <rootNode>", "Name of root node")
      .option("-e, --encode", "Encode output as HTML entities")
      .option("--no-encode", "Disable encoding of output as HTML entities", true)
      .option("-h, --help", " Show the usage/help documentation.")
      .action((action) => {
        program.json = action.json;
        program.template = action.template;
        program.rootNode = action.rootNode;
        program.encode = action.encode;
      })
      .parse(args);

    if (!program.json || !program.template) {
      console.error(
        "Error: Required option --json <json> or --template <template> not specified"
      );
      console.error("");
      console.error("Usage: json-to-handlebars --json <json> --template <template> [options]");
      console.error("");
      console.error("");
      console.error("Options:");
      console.error("--json <json>  Input JSON file");
      console.error("--template <template>  Input Handlebars template file");
      console.error("-e, --encode  Encode output as HTML entities");
      console.error("-h, --help    Output usage information");
      console.error("");
      process.exit(1);
    }

    // Read the input JSON file
    const inputJSON = fs.readFileSync(program.json, "utf-8");
    var json = JSON.parse(inputJSON);

    if (program.rootNode) {
      json = json[program.rootNode];
    }

    // Read the input Handlebars template file
    const inputTemplate = fs.readFileSync(program.template, "utf-8");

    // Register inline helpers with Handlebars
    const inlineHelperRegex = /{{#?\*inline [^}]*{{\/inline}}/mg;
    let match;

    while ((match = inlineHelperRegex.exec(inputTemplate)) !== null) {
      const helperName = match[1];

      //throw `$Registering helpers ${helperName} - ${match}`;

      eval(`handlebars.registerHelper('${helperName}', function() { ${match.input.slice(match.index + match[0].length).split('#*/')[0].trim()} });`);
    }

    const template = handlebars.compile(inputTemplate);

    // Use the Handlebars library to convert the input JSON to Markdown format using the Handlebars template
    const output = template(json);

    // Output the resulting Markdown to the standard output, optionally HTML-encoded if the --encode flag is passed
    if (program.encode) {
      console.log(output); // Non-encoded output
    } else {
      console.log(he.decode(output));
    }
  } catch (err) {
    console.error(err);
  }
}

runApp(process.argv);

module.exports = { runApp };
