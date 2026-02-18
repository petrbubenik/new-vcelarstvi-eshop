import { MetadataRoute } from 'next'

// Force dynamic rendering for sitemap
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.vcelarstvi-bubenik.cz'

  try {
    const { prisma } = await import('@/lib/prisma')

    // Get all products
    const products = await prisma.product.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1,
      },
      {
        url: `${baseUrl}/obchodni-podminky`,
        lastModified: new Date('2026-02-01'),
        changeFrequency: 'monthly',
        priority: 0.3,
      },
      {
        url: `${baseUrl}/doprava-a-platba`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
    ]

    // Product pages
    const productPages: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${baseUrl}/produkt/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

    return [...staticPages, ...productPages]
  } catch (error) {
    // If database is unavailable, return static pages only
    console.error('Sitemap generation error:', error)

    const staticPages: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1,
      },
      {
        url: `${baseUrl}/obchodni-podminky`,
        lastModified: new Date('2026-02-01'),
        changeFrequency: 'monthly',
        priority: 0.3,
      },
      {
        url: `${baseUrl}/doprava-a-platba`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
    ]

    return staticPages
  }
}
