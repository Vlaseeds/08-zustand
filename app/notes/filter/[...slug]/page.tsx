import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '../../../../lib/getQueryClient';
import { fetchNotes } from '../../../../lib/api';
import NotesClient from './Notes.client';

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const tag = resolvedParams.slug[0] || 'all';
  const displayTag = tag === 'all' ? 'All Notes' : `${tag} Notes`;

  return {
    title: `${displayTag} | NoteHub`,
    description: `Browse all your ${displayTag.toLowerCase()} in NoteHub.`,
    openGraph: {
      title: `${displayTag} | NoteHub`,
      description: `Browse all your ${displayTag.toLowerCase()} in NoteHub.`,
      url: 'https://notehub.com/',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub Cover Image',
        },
      ],
    },
  };
}

export default async function NotesFilterPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const tag = resolvedParams.slug[0] || 'all';
  
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag],
    queryFn: () => fetchNotes(1, 12, '', tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient currentTag={tag} />
    </HydrationBoundary>
  );
}