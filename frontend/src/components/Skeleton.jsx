function Skeleton({ className = '', style = {} }) {
  return <div className={`skeleton ${className}`} style={style} aria-hidden="true" />;
}

export function SkeletonCard() {
  return (
    <div className="card">
      <Skeleton className="skeleton-text-lg" style={{ width: '40%' }} />
      <Skeleton className="skeleton-text" style={{ width: '70%' }} />
      <Skeleton className="skeleton-text" style={{ width: '55%' }} />
    </div>
  );
}

export function SkeletonReport() {
  return (
    <div className="loading-page">
      <div className="skeleton-stack">
        <Skeleton className="skeleton-text-lg" style={{ width: '60%', margin: '0 auto' }} />
        <Skeleton className="skeleton-text" style={{ width: '40%', margin: '0 auto' }} />
        <Skeleton className="skeleton-circle" />
        <Skeleton className="skeleton-card" />
        <Skeleton className="skeleton-card" style={{ height: 80 }} />
      </div>
    </div>
  );
}

export function SkeletonHistory() {
  return (
    <div className="app-page page-enter">
      <div className="container">
        <Skeleton className="skeleton-card" style={{ height: 64, marginBottom: 32 }} />
        <div className="grid-3 mb-4">
          <Skeleton className="skeleton-card" />
          <Skeleton className="skeleton-card" />
          <Skeleton className="skeleton-card" />
        </div>
        <Skeleton className="skeleton-card" style={{ height: 140 }} />
        <Skeleton className="skeleton-card" style={{ height: 140, marginTop: 16 }} />
      </div>
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="app-page page-enter">
      <div className="container">
        <Skeleton className="skeleton-card" style={{ height: 64, marginBottom: 32 }} />
        <div className="grid-2">
          <Skeleton className="skeleton-card" style={{ height: 320 }} />
          <Skeleton className="skeleton-card" style={{ height: 320 }} />
        </div>
      </div>
    </div>
  );
}

export default Skeleton;
