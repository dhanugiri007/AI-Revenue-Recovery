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
  policy_retrieved: "bg-gray-100 text-gray-700",
  ai_decision_made: "bg-indigo-100 text-indigo-700",
  guardrail_blocked: "bg-red-100 text-red-700",
  human_reviewed: "bg-yellow-100 text-yellow-700",
  action_executed: "bg-green-100 text-green-700",
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
    <div className="mt-2">
      <button
        onClick={handleToggle}
        className="text-xs text-gray-500 hover:text-gray-700 underline"
      >
        {expanded ? "Hide audit trail" : "View audit trail"}
      </button>

      {expanded && (
        <div className="mt-2 border-l-2 border-gray-200 pl-4 space-y-2">
          {isLoading ? (
            <p className="text-xs text-gray-400">Loading audit trail...</p>
          ) : !logs || logs.length === 0 ? (
            <p className="text-xs text-gray-400">No audit entries yet.</p>
          ) : (
            logs.map((log) => (
              <div key={log._id} className="text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full font-medium ${categoryColors[log.eventCategory]}`}
                  >
                    {categoryLabels[log.eventCategory]}
                  </span>
                  <span className="text-gray-400">
                    {new Date(log.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">{log.summary}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AuditTrail;