import { useState, useEffect } from "react";
import { useCompany } from "../hooks/useCompany";

const CompanySetup = () => {
  const { company, loading, createCompany, updateCompany } = useCompany();
  const [formData, setFormData] = useState({ name: "", industry: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (company) {
      setFormData({ name: company.name, industry: company.industry || "" });
    }
  }, [company]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      if (company) {
        await updateCompany(formData);
        setSuccess("Company updated");
      } else {
        await createCompany(formData);
        setSuccess("Company created");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-zinc-500 mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-md space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wider text-zinc-600">Settings</p>
        <h1 className="text-2xl font-semibold text-white mt-1">
          {company ? "Company Settings" : "Set Up Your Company"}
        </h1>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
        {error && (
          <p className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 p-2 rounded-lg mb-4">
            {error}
          </p>
        )}
        {success && (
          <p className="text-emerald-400 text-sm text-center bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg mb-4">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Company Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/30"
            required
          />

          <input
            type="text"
            name="industry"
            placeholder="Industry (optional)"
            value={formData.industry}
            onChange={handleChange}
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/30"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-white text-black py-2.5 text-sm font-medium hover:bg-zinc-200 transition disabled:opacity-50"
          >
            {submitting ? "Saving..." : company ? "Update Company" : "Create Company"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompanySetup;