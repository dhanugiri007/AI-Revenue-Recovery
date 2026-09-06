import { useAnalytics } from "../hooks/useAnalytics";
import { useCompany } from "../../company/hooks/useCompany";
import { Link } from "react-router-dom";

const actionLabels = {
  retry_payment: "Retry Payment",
  retry_payment_after_delay: "Retry (Delayed)",
  send_email_update_payment_method: "Update Payment Method",
  send_outreach_email_with_discount: "Outreach + Discount",
  send_outreach_email_no_discount: "Outreach (No Discount)",
  escalate_to_human: "Escalate to Human",
};

const StatCard = ({ label, value, accent }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`text-3xl font-bold mt-1 ${accent || "text-gray-800"}`}>{value}</p>
  </div>
);

const BarRow = ({ label, count, max }) => {
  const widthPercent = max > 0 ? (count / max) * 100 : 0;
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="text-gray-500 font-medium">{count}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className="bg-indigo-500 h-2 rounded-full transition-all"
          style={{ width: `${widthPercent}%` }}
        />
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { company } = useCompany();
  const { summary, timeline, loading } = useAnalytics();

  if (!company) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-500 mb-4">Set up your company to see your dashboard.</p>
        <Link to="/company" className="text-blue-600 font-medium hover:underline">
          Set up company →
        </Link>
      </div>
    );
  }

  if (loading || !summary) {
    return <p className="text-center mt-10 text-gray-500">Loading dashboard...</p>;
  }

  const maxActionCount = Math.max(...summary.decisionsByAction.map((d) => d.count), 1);
  const maxTimelineCount = Math.max(...timeline.map((t) => t.count), 1);

  const executionCompleted = summary.executionsByStatus.find((e) => e._id === "completed")?.count || 0;
  const executionFailed = summary.executionsByStatus.find((e) => e._id === "failed")?.count || 0;

  return (
    <div className="max-w-5xl mx-auto mt-10 space-y-8 px-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Events" value={summary.totalEvents} />
        <StatCard label="Total Decisions" value={summary.totalDecisions} />
        <StatCard
          label="Guardrail Block Rate"
          value={`${Math.round(summary.guardrailBlockRate * 100)}%`}
          accent={summary.guardrailBlockRate > 0.3 ? "text-red-500" : "text-gray-800"}
        />
        <StatCard
          label="Pending Reviews"
          value={summary.pendingReviews}
          accent={summary.pendingReviews > 0 ? "text-orange-500" : "text-gray-800"}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Decisions by action */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-bold mb-4">Decisions by Action</h2>
          {summary.decisionsByAction.length === 0 ? (
            <p className="text-sm text-gray-400">No decisions generated yet.</p>
          ) : (
            summary.decisionsByAction.map((item) => (
              <BarRow
                key={item._id}
                label={actionLabels[item._id] || item._id}
                count={item.count}
                max={maxActionCount}
              />
            ))
          )}
        </div>

        {/* Execution outcomes */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-bold mb-4">Execution Outcomes</h2>
          {executionCompleted === 0 && executionFailed === 0 ? (
            <p className="text-sm text-gray-400">No actions executed yet.</p>
          ) : (
            <>
              <BarRow label="Completed" count={executionCompleted} max={Math.max(executionCompleted, executionFailed)} />
              <BarRow label="Failed" count={executionFailed} max={Math.max(executionCompleted, executionFailed)} />
            </>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-bold mb-4">Event Volume Over Time</h2>
        {timeline.length === 0 ? (
          <p className="text-sm text-gray-400">No events yet.</p>
        ) : (
          <div className="flex items-end gap-2 h-32">
            {timeline.map((day) => (
              <div key={day._id} className="flex-1 flex flex-col items-center justify-end h-full">
                <div
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${(day.count / maxTimelineCount) * 100}%` }}
                  title={`${day.count} events`}
                />
                <span className="text-xs text-gray-400 mt-1 rotate-45 origin-left whitespace-nowrap">
                  {day._id}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="flex gap-4 flex-wrap">
        <Link to="/events" className="text-blue-600 hover:underline text-sm">
          View Payment Events →
        </Link>
        <Link to="/reviews" className="text-blue-600 hover:underline text-sm">
          View Review Queue →
        </Link>
        <Link to="/customers" className="text-blue-600 hover:underline text-sm">
          Manage Customers →
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;