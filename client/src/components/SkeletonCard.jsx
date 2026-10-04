export default function SkeletonCard() {
  return (
    <div className="card listing-card">
      <div className="skeleton-img skeleton-shimmer"></div>
      <div className="card-body">
        <div className="row-between">
          <div className="skeleton-tag skeleton-shimmer"></div>
          <div className="skeleton-rating skeleton-shimmer"></div>
        </div>
        <div className="skeleton-title skeleton-shimmer"></div>
        <div className="skeleton-location skeleton-shimmer"></div>
        <div className="skeleton-price skeleton-shimmer"></div>
      </div>
    </div>
  );
}
