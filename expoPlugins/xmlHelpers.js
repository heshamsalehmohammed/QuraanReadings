// xmlHelpers.js
const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");

/**
 * Reads an XML file from disk and parses it into a JavaScript object.
 * If the file doesn't exist, returns a minimal structure: { resources: {} }.
 */
async function readXmlFile(filePath) {
  let xmlContent = "";
  try {
    xmlContent = fs.readFileSync(filePath, "utf8");
  } catch (err) {
    // File might not exist yet, so return a blank <resources> object
    return { resources: {} };
  }
  const parser = new xml2js.Parser();
  return await parser.parseStringPromise(xmlContent);
}

/**
 * Writes a JavaScript object as XML back to disk,
 * ensuring only ONE <resources> element appears.
 */
function writeXmlFile(filePath, xmlObject) {
  const builder = new xml2js.Builder({
    headless: true,
    explicitRoot: false,
  });
  const xmlContent = builder.buildObject(xmlObject);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  // We do NOT wrap in <resources>...</resources> again,
  // because the top-level 'resources' key in xmlObject
  // will produce <resources> in the final output.
  fs.writeFileSync(filePath, xmlContent, "utf8");
}

/**
 * Adds or updates a <style> element in the given XML object.
 *
 * styleData format example:
 * {
 *   name: 'CustomDatePickerTheme',
 *   parent: 'Theme.Material3.Light.Dialog.Alert',
 *   items: [
 *     { name: 'android:colorPrimary', value: '@color/datePickerHeaderColor' },
 *     ...
 *   ]
 * }
 */
function addOrUpdateStyle(xmlObject, styleData) {
  if (!xmlObject.resources) {
    xmlObject.resources = {};
  }
  if (!xmlObject.resources.style) {
    xmlObject.resources.style = [];
  }

  // Find an existing style with the same name
  const existingStyle = xmlObject.resources.style.find(
    (s) => s.$.name === styleData.name
  );

  const newStyle = {
    $: { name: styleData.name, parent: styleData.parent },
    item: styleData.items.map((item) => ({
      $: { name: item.name },
      _: item.value,
    })),
  };

  if (existingStyle) {
    // Replace the old one
    const idx = xmlObject.resources.style.indexOf(existingStyle);
    xmlObject.resources.style[idx] = newStyle;
  } else {
    // Add new style
    xmlObject.resources.style.push(newStyle);
  }
}

module.exports = {
  readXmlFile,
  writeXmlFile,
  addOrUpdateStyle,
};
