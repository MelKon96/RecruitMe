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

    // Здесь можно не выходить молча, если узла ещё нет: смена ref.current не перезапускает эффект, и когда sentinel появится позже, наблюдатель так и не подпишется.
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
