import React from 'react';

export function Skeleton({ className = '' }) {
  return <span aria-hidden className={`skeleton block ${className}`} />;
}

/** Shimmering stand-in for PostCard so the grid never jumps while loading. */
export function PostCardSkeleton({ index = 0 }) {
  return (
    <div
      className="card !shadow-none p-3"
      style={{ animationDelay: `${index * 90}ms` }}
      aria-hidden
    >
      <Skeleton className="mb-4 aspect-[16/10] w-full rounded-xl" />
      <Skeleton className="mb-2 h-3 w-20 rounded-full" />
      <Skeleton className="mb-2 h-5 w-[85%] rounded-md" />
      <Skeleton className="h-5 w-[55%] rounded-md" />
    </div>
  );
}

export function GridSkeleton({ count = 8, className = '' }) {
  return (
    <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} index={i} />
      ))}
    </div>
  );
}

/** Article skeleton for /post/[slug]. */
export function ArticleSkeleton() {
  return (
    <div aria-hidden className="mx-auto max-w-3xl space-y-5">
      <Skeleton className="mx-auto h-4 w-32 rounded-full" />
      <Skeleton className="h-12 w-[90%] rounded-lg" />
      <Skeleton className="h-12 w-[62%] rounded-lg" />
      <Skeleton className="mt-8 aspect-[16/9] w-full rounded-2xl" />
      <div className="mt-8 space-y-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className={`h-4 rounded-full ${i % 3 === 2 ? 'w-[55%]' : 'w-full'}`} />
        ))}
      </div>
    </div>
  );
}

export default Skeleton;
