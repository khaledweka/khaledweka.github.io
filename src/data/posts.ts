import { getCollection } from 'astro:content';

export interface Post {
    slug: string;
    href: string;
    title: string;
    titleAr?: string;
    cardTitle?: string;
    excerpt: string;
    excerptAr?: string;
    date: Date;
    dateLabel: string;
    lang: 'en' | 'ar' | 'bi';
    image?: string;
    imageAlt?: string;
}

function formatDateLabel(date: Date): string {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

// Newest first. Ties on the same date use `order` (ascending).
export async function getAllPosts(): Promise<Post[]> {
    const entries = await getCollection('blog', ({ data }) => !data.hidden);

    const ranked = entries.map((entry) => ({
        order: entry.data.order ?? 0,
        post: {
            slug: entry.id,
            href: `/blog/${entry.id}.html`,
            title: entry.data.title,
            titleAr: entry.data.titleAr,
            cardTitle: entry.data.cardTitle,
            excerpt: entry.data.excerpt,
            excerptAr: entry.data.excerptAr,
            date: entry.data.date,
            dateLabel: formatDateLabel(entry.data.date),
            lang: entry.data.lang,
            image: entry.data.image,
            imageAlt: entry.data.imageAlt,
        } satisfies Post,
    }));

    return ranked
        .sort((a, b) => b.post.date.getTime() - a.post.date.getTime() || a.order - b.order)
        .map((r) => r.post);
}
