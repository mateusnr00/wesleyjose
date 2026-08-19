import type { MetadataRoute } from "next"
import { getProperties } from "@/lib/queries"
import { baseUrl } from "@/lib/url"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = baseUrl()

  const pages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/imoveis`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/vender`, changeFrequency: "monthly", priority: 0.9 },
  ]

  const listings: MetadataRoute.Sitemap = (await getProperties()).map((property) => ({
    url: `${base}/imoveis/${property.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  return [...pages, ...listings]
}
