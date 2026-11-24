// The Android app (mobile/) shows this same site inside an app window and adds
// "QpidsPlaceApp/<version>" to the browser name it reports. Pages use this to
// leave out things an app-store build may not show, such as card checkout.
export function inAndroidApp(): boolean {
  return typeof navigator !== "undefined" && /QpidsPlaceApp\//.test(navigator.userAgent);
}

// Google Play purchases. The app carries a small native piece (the
// NativePurchases plugin) that shows Google's own purchase sheet. The site
// reaches it through the bridge the app adds to the page; on the website it
// simply isn't there.
export type PlayProduct = { identifier: string; priceString: string; title?: string };
export type PlayPurchase = { productIdentifier: string; purchaseToken?: string; transactionId?: string; purchaseState?: string };

type PlayStore = {
  isBillingSupported(): Promise<{ isBillingSupported: boolean }>;
  getProducts(o: { productIdentifiers: string[]; productType: "inapp" }): Promise<{ products: PlayProduct[] }>;
  getPurchases(o: { productType: "inapp" }): Promise<{ purchases: PlayPurchase[] }>;
  purchaseProduct(o: {
    productIdentifier: string;
    productType: "inapp";
    appAccountToken?: string;
    isConsumable: boolean;
    autoAcknowledgePurchases: boolean;
  }): Promise<PlayPurchase>;
};

export function playStore(): PlayStore | null {
  if (!inAndroidApp()) return null;
  const cap = (window as any).Capacitor;
  return (cap?.Plugins?.NativePurchases as PlayStore | undefined) ?? null;
}

// Google reports "the member closed the sheet" as an error. It isn't one.
export function isPlayCancel(err: unknown): boolean {
  return /cancel/i.test(String((err as any)?.message ?? err ?? ""));
}
