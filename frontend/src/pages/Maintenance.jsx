import React from 'react';

export default function Maintenance({ user }) {
  if(!user?.isAdmin) return <div className="card">Admin only</div>;
  return (
    <div className="card">
      <h3>Maintenance</h3>
      <p className="small">Admin feature group — build reports, run transactions, seeds, etc. Use backend routes to add reporting endpoints as needed.</p>
      <div className="card">
        <h4>Reports (example)</h4>
        <div className="small">You can add API endpoints to download CSVs or compute monthly issued books, fines collected, membership counts, etc.</div>
      </div>
    </div>
  );
}
