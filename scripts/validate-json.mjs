import Ajv from "ajv";
import fs from "node:fs/promises";
import path from "node:path";

// Process args
const args = process.argv.slice(2);
const type = args[0];

// Setup validator
const ajv = new Ajv({ strict: false, allErrors: true });

// Define custom formats
ajv.addFormat('url_safe', /^[a-z0-9\-\_]*$/)

try
{
    // Load json + schema
    const jsonRaw = await fs.readFile(path.resolve(`./data/${type}.json`), "utf8");
    const schemaRaw = await fs.readFile(path.resolve(`./schemas/${type}.schema.json`), "utf8");

    const json = JSON.parse(jsonRaw);
    const schema = JSON.parse(schemaRaw);

    console.log(`Validating ${type}.json`);
    //console.log(`Shchema: ${schemaRaw}`);
    //console.log(`Json: ${jsonRaw}`);

    // Validate the json against the schema
    const validate = ajv.compile(schema);
    const isValid = validate(json);

    console.log(`Is Valid: ${isValid}`);

    // Output the message
    if (!isValid) {
        throw Error(ajv.errorsText(validate.errors))
    } else {
        // You don't need to print anything when it passes.
    }
} 
catch (err) 
{
    console.error(err.message);
    process.exit(1);
}