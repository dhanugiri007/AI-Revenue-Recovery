
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
  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
    <p className="text-[11px] uppercase tracking-wider text-zinc-600">{label}</p>
    <p className={`text-3xl font-semibold mt-2 ${accent || "text-white"}`}>{value}</p>
  </div>
);

const BarRow = ({ label, count, max }) => {
  const widthPercent = max > 0 ? (count / max) * 100 : 0;
  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-zinc-400">{label}</span>
        <span className="text-zinc-500 font-medium">{count}</span>
      </div>
      <div className="w-full bg-white/5 rounded-full h-1.5">
        <div
          className="bg-white h-1.5 rounded-full transition-all"
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
        <p className="text-zinc-500 mb-4">Set up your company to see your dashboard.</p>
        <Link to="/company" className="text-white text-sm font-medium hover:underline">
          Set up company →
        </Link>
      </div>
    );
  }

  if (loading || !summary) {
    return <p className="text-zinc-500 mt-10">Loading dashboard...</p>;
  }

  const maxActionCount = Math.max(...summary.decisionsByAction.map((d) => d.count), 1);
  const maxTimelineCount = Math.max(...timeline.map((t) => t.count), 1);

  const executionCompleted = summary.executionsByStatus.find((e) => e._id === "completed")?.count || 0;
  const executionFailed = summary.executionsByStatus.find((e) => e._id === "failed")?.count || 0;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-wider text-zinc-600">Overview</p>
        <h1 className="text-2xl font-semibold text-white mt-1">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Events" value={summary.totalEvents} />
        <StatCard label="Total Decisions" value={summary.totalDecisions} />
        <StatCard
          label="Guardrail Block Rate"
          value={`${Math.round(summary.guardrailBlockRate * 100)}%`}
          accent={summary.guardrailBlockRate > 0.3 ? "text-red-400" : "text-white"}
        />
        <StatCard
          label="Pending Reviews"
          value={summary.pendingReviews}
          accent={summary.pendingReviews > 0 ? "text-orange-400" : "text-white"}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h2 className="text-sm font-medium text-white mb-4">Decisions by Action</h2>
          {summary.decisionsByAction.length === 0 ? (
            <p className="text-xs text-zinc-600">No decisions generated yet.</p>
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

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h2 className="text-sm font-medium text-white mb-4">Execution Outcomes</h2>
          {executionCompleted === 0 && executionFailed === 0 ? (
            <p className="text-xs text-zinc-600">No actions executed yet.</p>
          ) : (
            <>
              <BarRow label="Completed" count={executionCompleted} max={Math.max(executionCompleted, executionFailed)} />
              <BarRow label="Failed" count={executionFailed} max={Math.max(executionCompleted, executionFailed)} />
            </>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <h2 className="text-sm font-medium text-white mb-4">Event Volume Over Time</h2>
        {timeline.length === 0 ? (
          <p className="text-xs text-zinc-600">No events yet.</p>
        ) : (
          <div className="flex items-end gap-2 h-28">
            {timeline.map((day) => (
              <div key={day._id} className="flex-1 flex flex-col items-center justify-end h-full">
                <div
                  className="w-full bg-white rounded-t"
                  style={{ height: `${(day.count / maxTimelineCount) * 100}%` }}
                  title={`${day.count} events`}
                />
                <span className="text-[10px] text-zinc-600 mt-2">{day._id.slice(5)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-5 flex-wrap pt-2">
        <Link to="/events" className="text-xs text-zinc-400 hover:text-white transition">
          View Recovery Cases →
        </Link>
        <Link to="/reviews" className="text-xs text-zinc-400 hover:text-white transition">
          View Review Queue →
        </Link>
        <Link to="/customers" className="text-xs text-zinc-400 hover:text-white transition">
          Manage Customers →
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;