// withCustomDatePickerTheme.js
const path = require("path");
const {
  withDangerousMod,
  withAndroidManifest,
} = require("@expo/config-plugins");
const { readXmlFile, writeXmlFile, addOrUpdateStyle } = require("./xmlHelpers");

/**
 * We define:
 * 1) MyAppTheme (the main theme for your entire app),
 *    extending Theme.Material3.Light.NoActionBar to remove the top bar
 *    and ensure full screen.
 *    Also sets `android:alertDialogTheme` => CustomDatePickerTheme,
 *    so system dialogs (date/time pickers) use our custom color styling.
 *
 * 2) DialogButtonStyle (a style for the OK/Cancel buttons in dialogs),
 *    which sets `android:textColor` to @color/datePickerHeaderColor.
 *
 * 3) CustomDatePickerTheme (the actual date picker dialog theme),
 *    extending Theme.Material3.Light.Dialog.Alert, referencing:
 *      - colorPrimary, colorAccent => @color/datePickerHeaderColor
 *      - android:buttonBarPositiveButtonStyle => DialogButtonStyle
 *      - android:buttonBarNegativeButtonStyle => DialogButtonStyle
 *
 * The net effect:
 * - No native "FleetManagement" bar at the top (NoActionBar).
 * - The native OK & Cancel buttons in the date picker
 *   inherit the same color as the header (#77778D or #222B45).
 */
function withCustomDatePickerTheme(config) {
  // 1) Use a dangerous mod to edit styles.xml and add our themes/styles.
  config = withDangerousMod(config, [
    "android",
    async (config) => {
      const resPath = path.join(
        config.modRequest.platformProjectRoot,
        "app/src/main/res"
      );
      const stylesPath = path.join(resPath, "values", "styles.xml");

      // Read or create styles.xml
      const stylesXml = await readXmlFile(stylesPath);

      // (A) Main app theme with NO ACTION BAR (removes the default top bar)
      addOrUpdateStyle(stylesXml, {
        name: "MyAppTheme",
        parent: "Theme.Material3.Light.NoActionBar",
        items: [
          // All system dialogs will use CustomDatePickerTheme
          {
            name: "android:alertDialogTheme",
            value: "@style/CustomDatePickerTheme",
          },
        ],
      });

      // (B) A button style to color the OK/Cancel text
      addOrUpdateStyle(stylesXml, {
        name: "DialogButtonStyle",
        // We extend a Material 3 dialog button style
        // so that it's appropriate for alert dialogs
        parent: "Widget.Material3.Button.TextButton.Dialog",
        items: [
          {
            // The button text color uses the same color as your header
            name: "android:textColor",
            value: "@color/datePickerHeaderColor",
          },
        ],
      });

      // (C) The custom date picker dialog theme
      addOrUpdateStyle(stylesXml, {
        name: "CustomDatePickerTheme",
        parent: "Theme.Material3.Light.Dialog.Alert",
        items: [
          // Use datePickerHeaderColor for the dialog’s header/spinner
          {
            name: "android:colorPrimary",
            value: "@color/datePickerHeaderColor",
          },
          {
            name: "android:colorAccent",
            value: "@color/datePickerHeaderColor",
          },
          // Ensure the OK & Cancel buttons match
          {
            name: "android:buttonBarPositiveButtonStyle",
            value: "@style/DialogButtonStyle",
          },
          {
            name: "android:buttonBarNegativeButtonStyle",
            value: "@style/DialogButtonStyle",
          },
        ],
      });

      // Write back to disk
      writeXmlFile(stylesPath, stylesXml);
      return config;
    },
  ]);

  // 2) Modify AndroidManifest.xml to apply "MyAppTheme" (NoActionBar) to MainActivity.
  config = withAndroidManifest(config, (configProps) => {
    const androidManifest = configProps.modResults;
    const app = androidManifest.manifest.application?.[0];
    if (!app?.activity) return configProps;

    const mainActivity = app.activity.find(
      (a) => a.$["android:name"] === ".MainActivity"
    );
    if (mainActivity) {
      mainActivity.$["android:theme"] = "@style/MyAppTheme";
    }
    return configProps;
  });

  return config;
}

module.exports = withCustomDatePickerTheme;
