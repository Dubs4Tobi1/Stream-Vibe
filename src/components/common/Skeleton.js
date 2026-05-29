// ============================================
// StreamVibe – Skeleton Loader
// ============================================
import React from 'react';
import './Skeleton.css';

export const SkeletonBox = ({ width, height, rounded, style }) => (
  <div
    className={`skeleton-box ${rounded ? 'skeleton-rounded' : ''}`}
    style={{ width, height, ...style }}
  />
);

export const VideoCardSkeleton = () => (
  <div className="video-card-skeleton">
    <div className="skeleton-thumb" />
    <div className="skeleton-info">
      <div className="skeleton-avatar" />
      <div className="skeleton-text-block">
        <SkeletonBox height="14px" width="90%" />
        <SkeletonBox height="14px" width="70%" />
        <SkeletonBox height="12px" width="50%" style={{ marginTop: '6px' }} />
      </div>
    </div>
  </div>
);

export const VideoGridSkeleton = ({ count = 8 }) => (
  <div className="video-grid">
    {Array.from({ length: count }).map((_, i) => (
      <VideoCardSkeleton key={i} />
    ))}
  </div>
);

const Spinner = ({ size = 40 }) => (
  <div className="spinner" style={{ width: size, height: size }} />
);

export default Spinner;
