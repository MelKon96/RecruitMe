import { useEffect, type RefObject } from 'react';

interface IUseInfiniteScrollOptions {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export const useInfiniteScroll = (
  targetRef: RefObject<HTMLDivElement | null>,
  { hasNextPage, isFetchingNextPage, fetchNextPage }: IUseInfiniteScrollOptions,
) => {
  useEffect(() => {
    const target = targetRef.current;

    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [targetRef, hasNextPage, isFetchingNextPage, fetchNextPage]);
};
