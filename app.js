#!/usr/bin/env node
"use strict";

const fs = require("fs");
const program = require("commander");
const handlebars = require("handlebars");
const helpers = require('handlebars-helpers')();
handlebars.registerHelper('lookup', helpers.lookup);
handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});
handlebars.registerHelper('findShape', function() {return "shapexyz"});

function runApp(args) {
  try {
    program
      .option("-j, --json <json>", "input JSON file")
      .option("-t, --template <template>", "input Handlebars template file")
      .option("-n, --root-node <rootNode>", "Name of root node")
      .option("-h, --help", " Show the usage/help documentation.")
      .action((action) => {
        program.json = action.json;
        program.template = action.template;
        program.rootNode = action.rootNode;
      })
      .parse(args);

    if (!program.json || !program.template) {
      console.error(
        "Error: Required option --json <json> or --template <template> not specified"
      );
      console.error("");
      console.error(
        "Usage: json-to-handlebars --json <json> --template <template> [options]"
      );
      console.error("");
      console.error("");
      console.error("Options:");
      console.error("--json <json>  Input JSON file");
      console.error("--template <template>  Input Handlebars template file");
      console.error("-h, --help     Output usage information");
      console.error("");

      process.exit(1);
    }

    // Read the input JSON file
    const inputJSON = fs.readFileSync(program.json, "utf-8");
    var json = JSON.parse(inputJSON);

    if (program.rootNode) json = json[program.rootNode];

    // Read the input Handlebars template file
    const inputTemplate = fs.readFileSync(program.template, "utf-8");

    // Register inline helpers with Handlebars
    const inlineHelperRegex = /^#\\*inline\s+([\w-]+)\s*$/mg;
    let match;
    while ((match = inlineHelperRegex.exec(inputTemplate)) !== null) {
      const helperName = match[1];
      const helperCode = `handlebars.registerHelper('${helperName}', function() { ${match.input.slice(match.index + match[0].length).split('#*/')[0].trim()} });`;
      eval(helperCode);
    }

    const template = handlebars.compile(inputTemplate);

    // Use the Handlebars library to convert the input JSON to Markdown format using the Handlebars template
    const markdown = template(json);

    // Output the resulting Markdown to the standard output
    console.log(markdown);
  } catch (err) {
    console.error(err);
  }
}

runApp(process.argv);

module.exports = { runApp };

