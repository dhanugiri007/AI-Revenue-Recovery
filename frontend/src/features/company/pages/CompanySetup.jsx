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
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {company ? "Company Settings" : "Set Up Your Company"}
      </h2>

      {error && (
        <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded mb-4">
          {error}
        </p>
      )}
      {success && (
        <p className="text-green-600 text-sm text-center bg-green-50 p-2 rounded mb-4">
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
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="text"
          name="industry"
          placeholder="Industry (optional)"
          value={formData.industry}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Saving..." : company ? "Update Company" : "Create Company"}
        </button>
      </form>
    </div>
  );
};

export default CompanySetup;