import { useState, useRef } from "react";
import { usePolicy } from "../hooks/usePolicy";
import { useCompany } from "../../company/hooks/useCompany";

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
};

const PolicyList = () => {
  const { company } = useCompany();
  const { policies, loading, uploadPolicy, deletePolicy } = usePolicy();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      await uploadPolicy(file);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this policy document?")) return;
    try {
      await deletePolicy(id);
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  if (!company) {
    return <p className="text-zinc-500 mt-10">Set up your company first before uploading policies.</p>;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wider text-zinc-600">Policies</p>
        <h1 className="text-2xl font-semibold text-white mt-1">Policy Documents</h1>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
        {error && (
          <p className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 p-2 rounded-lg mb-4">
            {error}
          </p>
        )}

        <label className="inline-flex items-center gap-2 cursor-pointer rounded-full bg-white text-black px-5 py-2.5 text-sm font-medium hover:bg-zinc-200 transition mb-6">
          {uploading ? "Uploading..." : "Upload Policy (PDF/TXT)"}
          <input
            type="file"
            accept=".pdf,.txt"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {loading ? (
          <p className="text-zinc-500 text-sm">Loading policies...</p>
        ) : policies.length === 0 ? (
          <p className="text-zinc-600 text-sm">No policy documents uploaded yet.</p>
        ) : (
          <ul className="space-y-2">
            {policies.map((policy) => (
              <li
                key={policy._id}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-white">{policy.originalName}</p>
                  <p className="text-[11px] text-zinc-600 uppercase tracking-wider mt-0.5">
                    {policy.fileType}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] px-2 py-1 rounded-full border font-medium ${statusColors[policy.embeddingStatus]}`}
                  >
                    {policy.embeddingStatus}
                  </span>
                  <button
                    onClick={() => handleDelete(policy._id)}
                    className="text-xs text-zinc-500 hover:text-red-400 transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PolicyList;