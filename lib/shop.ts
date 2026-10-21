/**
 * Links to the Gilgamesh Enterprise shop, tagged with where on renewalmate.com
 * the click came from so Shopify's reports show which spot sends buyers.
 */
const SHOP = 'https://shop.gilgameshenterprise.com'

export function shopUrl(medium: string, path = '/'): string {
  const q = new URLSearchParams({ utm_source: 'renewalmate', utm_medium: medium })
  return `${SHOP}${path}?${q}`
}
