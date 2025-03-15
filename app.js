#!/usr/bin/env node
"use strict";

const fs = require("fs");
const program = require("commander");
const handlebars = require("handlebars");
const handlebarsHelpers = require('handlebars-helpers')();
const he = require('he');

// Register any entire set of helpers from 'handlebars-helpers'
handlebars.registerHelper(handlebarsHelpers);

// Register your custom helpers here
handlebars.registerHelper('json', function (context) {
  // Safely stringifies an object with 2-space indentation.
  return JSON.stringify(context, null, 2);
});

handlebars.registerHelper('lookup', function (obj, key) {
  // Looks up a key in an object, returning undefined if not found.
  if (!obj) return;
  return obj[key];
});

// Below are 10 other common / helpful custom helpers you might want:

// 1. Convert to lowercase
handlebars.registerHelper('toLowerCase', function (str) {
  return (str || "").toLowerCase();
});

// 2. Convert to uppercase
handlebars.registerHelper('toUpperCase', function (str) {
  return (str || "").toUpperCase();
});

// 3. Capitalize first letter
handlebars.registerHelper('capitalize', function (str) {
  if (!str || typeof str !== "string") return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
});

// 4. Equals comparison
handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});

// 5. Not equals
handlebars.registerHelper('ne', function (a, b) {
  return a !== b;
});

// 6. Logical AND
handlebars.registerHelper('and', function (a, b) {
  return a && b;
});

// 7. Logical OR
handlebars.registerHelper('or', function (a, b) {
  return a || b;
});

// 8. Logical NOT
handlebars.registerHelper('not', function (value) {
  return !value;
});

// 9. Repeat block n times
handlebars.registerHelper('times', function (n, block) {
  let accum = '';
  for (let i = 0; i < n; i++) {
    accum += block.fn(this);
  }
  return accum;
});

// 10. Default value helper (useful for fallback text)
handlebars.registerHelper('defaultValue', function (value, defaultVal) {
  return (value == null || value === '') ? defaultVal : value;
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
    let json = JSON.parse(inputJSON);

    if (program.rootNode) {
      json = json[program.rootNode];
    }

    // Read the input Handlebars template file
    const inputTemplate = fs.readFileSync(program.template, "utf-8");

    // If you have any inline helpers to parse from the template itself:
    const inlineHelperRegex = /{{#?\*inline [^}]*{{\/inline}}/mg;
    let match;
    while ((match = inlineHelperRegex.exec(inputTemplate)) !== null) {
      // Example usage of custom inline helper loading
      // This block is just an illustration; replace it with your own logic
    }

    const template = handlebars.compile(inputTemplate);

    // Generate final output
    const output = template(json);

    // If --encode is used, output raw
    // Else decode any HTML entities
    if (program.encode) {
      console.log(output);
    } else {
      console.log(he.decode(output));
    }
  } catch (err) {
    console.error(err);
  }
}

runApp(process.argv);

module.exports = { runApp };
