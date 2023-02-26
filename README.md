# json-to-handlebars

json-to-handlebars is a Node.js command-line tool that can parse JSON data and a Handlebars template and return the result in Markdown format (for example).

It allows developers to easily convert JSON data into Markdown format, making it simpler to integrate them into their software development workflow. The tool uses the Handlebars templating library to convert JSON data into a structured and easily queriable format.

By converting JSON data and a template into Markdown, json-to-handlebars allows developers to import and export them as other formats, which can be easily read and interpreted by other programs and libraries.

This tool is particularly useful for working with large and complex data that needs to be represented in a specific format, as it helps to structure and organize the data in a way that is more manageable and easier to understand.

## Installation
To install json-to-handlebars, you will need to have Node.js and npm installed on your machine. Once you have these prerequisites installed, you can install json-to-handlebars by running the following command:

`npm install -g eejai42/json-to-handlebars`

This will install json-to-handlebars globally, allowing you to use it from any directory on your machine.

## Usage
The json-to-handlebars command-line tool has the following options:

`-j, --json : Specify the input JSON file to be converted. This option is required.`
`-t, --template : Specify the input Handlebars template file. This option is required.`
`-r, --rootNode : Specify the root node in the input JSON file to be used as the context for the Handlebars template. This option is optional.`

## Examples
Here are some examples of using the json-to-handlebars tool. To convert a JSON file and a template into Markdown format, you can use the following command:

`json-to-handlebars -j data.json -t template.hbs`

`json-to-handlebars --json data.json --template template.hbs --rootNode root`

The first command will parse the data in the data.json file and the template in template.hbs to produce a Markdown file. The second example uses the root node in the data.json file as the context for the template.