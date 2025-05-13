// withSoftInputMode.js
const { withAndroidManifest } = require("@expo/config-plugins");

/**
 * A config plugin to modify the AndroidManifest.xml to prevent the keyboard from resizing your layout.
 */
function withSoftInputMode(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    const mainApplication = manifest.manifest.application[0];

    // Find the MainActivity inside the manifest.
    // It might be identified either as ".MainActivity" or "com.yourapp.MainActivity"
    const mainActivity = mainApplication.activity.find((activity) => {
      const activityName = activity["$"]["android:name"];
      return (
        activityName === ".MainActivity" ||
        activityName === "com.heshamapp.MainActivity"
      );
    });

    if (mainActivity) {
      // Set the windowSoftInputMode to "adjustPan".
      // You can change to "adjustNothing" if you want no adjustment at all.
      mainActivity["$"]["android:windowSoftInputMode"] = "adjustPan";
    } else {
      console.warn(
        "Could not find MainActivity in AndroidManifest.xml to set windowSoftInputMode"
      );
    }
    return config;
  });
}

module.exports = withSoftInputMode;
