"use client";

import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import Link from 'next/link'; 

import SearchBox from '../../../../components/SearchBox/SearchBox';
import Pagination from '../../../../components/Pagination/Pagination';
import NoteList from '../../../../components/NoteList/NoteList';

import { fetchNotes } from '../../../../lib/api';

import css from './NotesPage.module.css';

interface NotesClientProps {
  currentTag: string;
}

export default function NotesClient({ currentTag }: NotesClientProps) {
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearchTerm(value);
    setPage(1);
  }, 500);

  const { data, isLoading } = useQuery({
    queryKey: ['notes', page, searchTerm, currentTag], 
    queryFn: () => fetchNotes(page, 12, searchTerm, currentTag),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox onChange={handleSearch} />
        
        {totalPages > 1 && (
          <Pagination 
            totalPages={totalPages} 
            currentPage={page} 
            onPageChange={setPage} 
          />
        )}
        
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </div>

      {isLoading && <p>Loading, please wait...</p>}
      
      {notes.length > 0 && !isLoading && <NoteList notes={notes} />}
      {notes.length === 0 && !isLoading && <p>No notes found.</p>}

    </div>
  );
}