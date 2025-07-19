/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Your Name - Enter your first name to be displayed in the greeting. */
  "userName": string,
  /** Latitude - Latitude for weather forecast. */
  "latitude": string,
  /** Longitude - Longitude for weather forecast. */
  "longitude": string,
  /** Work Address - Your work address for commute time. */
  "workAddress"?: string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `show-my-name` command */
  export type ShowMyName = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `show-my-name` command */
  export type ShowMyName = {}
}

