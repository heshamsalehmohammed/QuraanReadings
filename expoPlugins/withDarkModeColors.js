// withDarkModeColors.js
const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");
const { withDangerousMod } = require("@expo/config-plugins");

/**
 * Read an XML file and parse it into a JS object.
 */
async function readXmlFile(filePath) {
  let xmlContent = "";
  try {
    xmlContent = fs.readFileSync(filePath, "utf8");
  } catch (err) {
    // File might not exist yet
    return { resources: {} };
  }

  const parser = new xml2js.Parser();
  return await parser.parseStringPromise(xmlContent);
}

/**
 * Write a JS object back to XML on disk, ensuring a single <resources> tag.
 */
function writeXmlFile(filePath, xmlObject) {
  const builder = new xml2js.Builder({
    headless: true,
    explicitRoot: false,
  });
  const xmlContent = builder.buildObject(xmlObject);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, xmlContent, "utf8");
}

/**
 * Add or update a <color> in <resources>.
 */
function addOrUpdateColor(xmlObject, name, value) {
  if (!xmlObject.resources) {
    xmlObject.resources = {};
  }
  if (!xmlObject.resources.color) {
    xmlObject.resources.color = [];
  }

  const existingColor = xmlObject.resources.color.find(
    (c) => c.$.name === name
  );
  if (existingColor) {
    existingColor._ = value;
  } else {
    xmlObject.resources.color.push({
      $: { name },
      _: value,
    });
  }
}

/**
 * withDarkModeColors:
 * - Edits values/colors.xml for LIGHT mode
 * - Edits values-night/colors.xml for DARK mode
 *
 * We define "datePickerHeaderColor" differently in each so it
 * automatically switches based on system night mode.
 */
function withDarkModeColors(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const androidResPath = path.join(
        config.modRequest.platformProjectRoot,
        "app/src/main/res"
      );

      const colorsXmlPath = path.join(androidResPath, "values", "colors.xml");
      const colorsNightXmlPath = path.join(
        androidResPath,
        "values-night",
        "colors.xml"
      );

      // Light mode
      const lightXml = await readXmlFile(colorsXmlPath);
      addOrUpdateColor(lightXml, "datePickerHeaderColor", "#77778D");
      writeXmlFile(colorsXmlPath, lightXml);

      // Dark mode
      const darkXml = await readXmlFile(colorsNightXmlPath);
      addOrUpdateColor(darkXml, "datePickerHeaderColor", "#222B45");
      writeXmlFile(colorsNightXmlPath, darkXml);

      return config;
    },
  ]);
}

module.exports = withDarkModeColors;
