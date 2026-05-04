import React from 'react';

export type StateProps = { loading?: boolean; empty?: boolean; error?: string | null };

export const StateShell: React.FC<{ state?: StateProps; children: React.ReactNode }> = ({ state, children }) => {
  if (state?.loading) return <div aria-busy="true"><div className="p-4"><span>Loading…</span></div></div>;
  if (state?.error) return <div role="alert" className="p-4 text-red-600">{state.error}</div>;
  if (state?.empty) return <div className="p-4"><span>No data</span></div>;
  return <>{children}</>;
};

export default StateShell;

