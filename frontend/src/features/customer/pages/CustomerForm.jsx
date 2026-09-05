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
  const { id } = useParams(); // present only in edit mode
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
            activeSince: data.activeSince?.slice(0, 10), // format for <input type="date">
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
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
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
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {isEdit ? "Edit Customer" : "Add Customer"}
      </h2>

      {error && (
        <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded mb-4">
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
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <select
          name="customerType"
          value={formData.customerType}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="individual">Individual</option>
          <option value="business">Business</option>
        </select>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Active Since</label>
          <input
            type="date"
            name="activeSince"
            value={formData.activeSince}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Outstanding Balance (INR)</label>
          <input
            type="number"
            name="outstandingBalance"
            value={formData.outstandingBalance}
            onChange={handleChange}
            min="0"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            name="hasActiveSupportTicket"
            checked={formData.hasActiveSupportTicket}
            onChange={handleChange}
          />
          Has an active support ticket
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Saving..." : isEdit ? "Update Customer" : "Add Customer"}
        </button>
      </form>
    </div>
  );
};

export default CustomerForm;