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

// Standalone static post (public/blog/), not part of the content collection
const ghostRowDate = new Date('2026-04-14T00:00:00Z');
const ghostRowPost: Post = {
    slug: 'ghost-row-problem-laravel-octane-swoole-kubernetes',
    href: '/blog/ghost-row-problem-laravel-octane-swoole-kubernetes.html',
    title: 'The Ghost Row Problem: Laravel Octane + Swoole in Kubernetes',
    titleAr: 'مشكلة الصف الشبح: Laravel Octane مع Swoole في Kubernetes',
    excerpt: 'How persistent Swoole worker connections can keep phantom transactions alive and silently lose INSERTs, plus practical production-safe fixes.',
    excerptAr: 'كيف تُبقي اتصالات Swoole الدائمة معاملات وهمية حيّة فتضيع عمليات INSERT بصمت، مع حلول عملية وآمنة للإنتاج.',
    date: ghostRowDate,
    dateLabel: formatDateLabel(ghostRowDate),
    lang: 'en',
};

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
    ranked.push({ order: 0, post: ghostRowPost });

    return ranked
        .sort((a, b) => b.post.date.getTime() - a.post.date.getTime() || a.order - b.order)
        .map((r) => r.post);
}
