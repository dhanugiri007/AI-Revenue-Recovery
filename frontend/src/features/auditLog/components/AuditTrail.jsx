import { useState } from "react";
import { useAuditLog } from "../hooks/useAuditLog";

const categoryLabels = {
  policy_retrieved: "Policy Retrieved",
  ai_decision_made: "AI Decision Made",
  guardrail_blocked: "Guardrail Blocked",
  human_reviewed: "Human Reviewed",
  action_executed: "Action Executed",
};

const categoryColors = {
  policy_retrieved: "bg-white/5 text-zinc-400 border-white/10",
  ai_decision_made: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  guardrail_blocked: "bg-red-500/10 text-red-400 border-red-500/20",
  human_reviewed: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  action_executed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

const AuditTrail = ({ eventId }) => {
  const { logsByEvent, loadingEventId, fetchAuditLogForEvent } = useAuditLog();
  const [expanded, setExpanded] = useState(false);

  const logs = logsByEvent[eventId];
  const isLoading = loadingEventId === eventId;

  const handleToggle = () => {
    if (!expanded && !logs) {
      fetchAuditLogForEvent(eventId);
    }
    setExpanded(!expanded);
  };

  return (
    <div className="mt-3">
      <button onClick={handleToggle} className="text-[11px] text-zinc-600 hover:text-zinc-300 transition">
        {expanded ? "Hide audit trail" : "View audit trail"}
      </button>

      {expanded && (
        <div className="mt-3 border-l border-white/10 pl-4 space-y-3">
          {isLoading ? (
            <p className="text-xs text-zinc-600">Loading audit trail...</p>
          ) : !logs || logs.length === 0 ? (
            <p className="text-xs text-zinc-600">No audit entries yet.</p>
          ) : (
            logs.map((log) => (
              <div key={log._id} className="text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full border font-medium ${categoryColors[log.eventCategory]}`}
                  >
                    {categoryLabels[log.eventCategory]}
                  </span>
                  <span className="text-zinc-700">
                    {new Date(log.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-zinc-500 mt-1">{log.summary}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AuditTrail;