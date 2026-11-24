import { apiRequest } from "@/api/client";
import type { CreditPackageId } from "@/config/creditPackages";
import * as WebBrowser from "expo-web-browser";

type ShopierPaymentResponse = {
  success: boolean;
  error?: string;
  paymentUrl?: string;
  fields?: Record<string, string>;
  orderId?: string;
};

export const createShopierPayment = async (packageId: CreditPackageId) =>
  apiRequest<ShopierPaymentResponse>("/api/payments/shopier/create", {
    method: "POST",
    body: { packageId },
  });

const buildAutoSubmitHtml = (
  paymentUrl: string,
  fields: Record<string, string>,
) => {
  const inputs = Object.entries(fields)
    .map(
      ([name, value]) =>
        `<input type="hidden" name="${escapeHtml(name)}" value="${escapeHtml(value)}" />`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Shopier Ödeme</title>
  </head>
  <body>
    <p style="font-family: system-ui; text-align:center; margin-top: 40px;">
      Güvenli ödeme sayfasına yönlendiriliyorsunuz...
    </p>
    <form id="shopier" method="POST" action="${escapeHtml(paymentUrl)}">
      ${inputs}
    </form>
    <script>document.getElementById('shopier').submit();</script>
  </body>
</html>`;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export const openShopierCheckout = async (
  paymentUrl: string,
  fields: Record<string, string>,
) => {
  const html = buildAutoSubmitHtml(paymentUrl, fields);
  const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
  await WebBrowser.openBrowserAsync(dataUrl);
};
