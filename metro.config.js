// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // 1) Set the transformer for SVG
  config.transformer.babelTransformerPath = require.resolve(
    "react-native-svg-transformer"
  );

  // 2) Remove svg from assetExts
  config.resolver.assetExts = config.resolver.assetExts.filter(
    (ext) => ext !== "svg"
  );

  // 3) Add svg to sourceExts
  config.resolver.sourceExts.push("svg");

  return config;
})();
