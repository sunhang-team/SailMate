'use client';

import { useState, useEffect } from 'react';

const DEFAULT_PER_PAGE = 4;
const LAPTOP_PER_PAGE = 3;
const TABLET_PER_PAGE = 2;
const MOBILE_PER_PAGE = 1;

export const usePerPage = () => {
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setPerPage(MOBILE_PER_PAGE);
      } else if (width < 1024) {
        setPerPage(TABLET_PER_PAGE);
      } else if (width < 1280) {
        setPerPage(LAPTOP_PER_PAGE);
      } else {
        setPerPage(DEFAULT_PER_PAGE);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return perPage;
};
