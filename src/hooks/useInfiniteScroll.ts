import { useCallback, useEffect, useState } from 'react';

interface IUseInfiniteScrollOptions {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export const useInfiniteScroll = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: IUseInfiniteScrollOptions) => {
  const [target, setTarget] = useState<HTMLDivElement | null>(null);

  const loadMoreRef = useCallback((node: HTMLDivElement | null) => {
    setTarget(node);
  }, []);

  useEffect(() => {
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
  }, [target, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return loadMoreRef;
};
