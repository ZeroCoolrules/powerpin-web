// The Android app (mobile/) shows this same site inside an app window and adds
// "QpidsPlaceApp/<version>" to the browser name it reports. Pages use this to
// leave out things an app-store build may not show, such as card checkout.
export function inAndroidApp(): boolean {
  return typeof navigator !== "undefined" && /QpidsPlaceApp\//.test(navigator.userAgent);
}
