import React from 'react';

type SharedDashboardProps = {
  /**
   * Share token that encodes tenant‑scoped read‑only access.
   */
  token: string;
};

/**
 * SharedDashboard renders a dashboard in read‑only mode.
 * It deliberately does **not** render any edit controls such as
 * edit buttons, delete icons, or drag‑and‑drop handles.
 *
 * In a full implementation the component would fetch the dashboard
 * definition using the token and render charts accordingly. For the
 * purpose of this story we only need to demonstrate the read‑only UI.
 */
const SharedDashboard: React.FC<SharedDashboardProps> = ({ token }) => {
  return (
    <div data-testid="shared-dashboard">
      <h1>Dashboard (Read‑Only)</h1>
      <p>Share token: {token}</p>
      {/* No edit controls are rendered here */}
    </div>
  );
};

export default SharedDashboard;
