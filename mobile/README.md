# Qpids Place Android app

A small Android app (built with Capacitor) that opens the live site,
https://qupidlist.xyz, in its own app window. The site is still the product:
anything deployed to the site shows up in the app without a new app release.
A new app release is only needed when something in this folder changes (name,
icon, permissions, native features).

Written from scratch for Qpids Place. No Dating Pro code is used.

## What is here

- `capacitor.config.json`: app id (`xyz.qupidlist.qpidsplace`), name, and the site address it loads.
- `android/`: the Android project. Targets Android 16 (API 36), which Google Play requires for new apps.
- `www/offline.html`: the page shown when the phone has no connection.
- `scripts/make-icons.mjs`: redraws the icon, splash screens and store graphics.
- `store/`: the 512 px icon and the 1024 x 500 feature graphic for the Play listing.

The app id is permanent once the app is published on Google Play. Change it in
`capacitor.config.json`, `android/app/build.gradle` and the Java package before
the first upload if you want a different one.

## Building

GitHub builds it: the "Qpids Place Android app" workflow runs when this folder
changes, or on demand from the Actions tab. Each run attaches
`qpids-place-test-apk`, which installs on any Android phone for testing.

For Google Play, add these repository secrets and run the workflow on `main`.
It then also attaches `qpids-place-play-bundle` (a signed `.aab`).

| Secret | What it is |
| --- | --- |
| `QPIDS_KEYSTORE_BASE64` | Your upload keystore file, base64 encoded |
| `QPIDS_KEYSTORE_PASSWORD` | The keystore password |
| `QPIDS_KEY_ALIAS` | The key name inside the keystore |
| `QPIDS_KEY_PASSWORD` | The key password |

Make the keystore once and keep a copy somewhere safe:

```
keytool -genkeypair -v -keystore upload.jks -alias qpids-upload -keyalg RSA -keysize 2048 -validity 10000
base64 -w0 upload.jks
```

To build on your own machine instead: `npm ci && npx cap sync android`, then
open `android/` in Android Studio.

## How the site knows it is in the app

The app adds `QpidsPlaceApp/1.0` to the browser name. `app/qpids/lib/native.ts`
reads it. Today the only use is the Sparks page, which leaves out card checkout
inside the app because Google Play has its own rules for selling in-app
currency.

## Not built yet

- Buying sparks inside the app (needs Google Play Billing or Google's US
  alternative billing programme).
- Push notifications.
