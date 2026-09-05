import { useState, useRef } from "react";
import { usePolicy } from "../hooks/usePolicy";
import { useCompany } from "../../company/hooks/useCompany";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
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
      fileInputRef.current.value = ""; // reset so same file can be re-selected
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
    return (
      <p className="text-center mt-10 text-gray-500">
        Set up your company first before uploading policies.
      </p>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Policy Documents</h2>

      {error && (
        <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded mb-4">
          {error}
        </p>
      )}

      <div className="mb-6">
        <label className="inline-block cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
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
      </div>

      {loading ? (
        <p className="text-gray-500">Loading policies...</p>
      ) : policies.length === 0 ? (
        <p className="text-gray-500">No policy documents uploaded yet.</p>
      ) : (
        <ul className="space-y-3">
          {policies.map((policy) => (
            <li
              key={policy._id}
              className="flex items-center justify-between border rounded-lg px-4 py-3"
            >
              <div>
                <p className="font-medium">{policy.originalName}</p>
                <p className="text-xs text-gray-400 uppercase">{policy.fileType}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    statusColors[policy.embeddingStatus]
                  }`}
                >
                  {policy.embeddingStatus}
                </span>
                <button
                  onClick={() => handleDelete(policy._id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PolicyList;