import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomer } from "../hooks/useCustomer";
import { getCustomerApi } from "../services/customer.api";

const emptyForm = {
  name: "",
  email: "",
  customerType: "individual",
  activeSince: "",
  outstandingBalance: 0,
  hasActiveSupportTicket: false,
};

const CustomerForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { createCustomer, updateCustomer } = useCustomer();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchCustomer = async () => {
        try {
          const data = await getCustomerApi(id);
          setFormData({
            name: data.name,
            email: data.email,
            customerType: data.customerType,
            activeSince: data.activeSince?.slice(0, 10),
            outstandingBalance: data.outstandingBalance,
            hasActiveSupportTicket: data.hasActiveSupportTicket,
          });
        } catch (err) {
          setError("Could not load customer");
        } finally {
          setLoading(false);
        }
      };
      fetchCustomer();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (isEdit) {
        await updateCustomer(id, formData);
      } else {
        await createCustomer(formData);
      }
      navigate("/customers");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-zinc-500 mt-10">Loading...</p>;
  }

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/30";

  return (
    <div className="max-w-md space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wider text-zinc-600">Customers</p>
        <h1 className="text-2xl font-semibold text-white mt-1">
          {isEdit ? "Edit Customer" : "Add Customer"}
        </h1>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
        {error && (
          <p className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 p-2 rounded-lg mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Customer Name"
            value={formData.name}
            onChange={handleChange}
            className={inputClass}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={inputClass}
            required
          />

          <select name="customerType" value={formData.customerType} onChange={handleChange} className={inputClass}>
            <option value="individual" className="bg-zinc-900">Individual</option>
            <option value="business" className="bg-zinc-900">Business</option>
          </select>

          <div>
            <label className="text-xs text-zinc-500 block mb-1.5">Active Since</label>
            <input
              type="date"
              name="activeSince"
              value={formData.activeSince}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="text-xs text-zinc-500 block mb-1.5">Outstanding Balance (INR)</label>
            <input
              type="number"
              name="outstandingBalance"
              value={formData.outstandingBalance}
              onChange={handleChange}
              min="0"
              className={inputClass}
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-zinc-400">
            <input
              type="checkbox"
              name="hasActiveSupportTicket"
              checked={formData.hasActiveSupportTicket}
              onChange={handleChange}
              className="accent-white"
            />
            Has an active support ticket
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-white text-black py-2.5 text-sm font-medium hover:bg-zinc-200 transition disabled:opacity-50"
          >
            {submitting ? "Saving..." : isEdit ? "Update Customer" : "Add Customer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;