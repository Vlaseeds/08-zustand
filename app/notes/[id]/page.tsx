import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '../../../lib/getQueryClient';
import { fetchNoteById } from '../../../lib/api';
import NoteDetailsClient from './NoteDetails.client';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const note = await fetchNoteById(resolvedParams.id);

  return {
    title: `${note.title} | NoteHub`,
    description: note.content.slice(0, 120) + '...',
    openGraph: {
      title: `${note.title} | NoteHub`,
      description: note.content.slice(0, 120) + '...',
      url: `https://notehub.com/notes/${resolvedParams.id}`, 
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

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const note = await fetchNoteById(resolvedParams.id);

  return {
    title: `${note.title} | NoteHub`,
    description: note.content.slice(0, 120) + '...',
    openGraph: {
      title: `${note.title} | NoteHub`,
      description: note.content.slice(0, 120) + '...',
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

export default async function NoteDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', resolvedParams.id],
    queryFn: () => fetchNoteById(resolvedParams.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}