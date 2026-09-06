import { Link } from "react-router-dom";
import { useCustomer } from "../hooks/useCustomer";
import { useCompany } from "../../company/hooks/useCompany";

const CustomerList = () => {
  const { company } = useCompany();
  const { customers, loading, deleteCustomer } = useCustomer();

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    await deleteCustomer(id);
  };

  if (!company) {
    return <p className="text-zinc-500 mt-10">Set up your company first before adding customers.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-zinc-600">Customers</p>
          <h1 className="text-2xl font-semibold text-white mt-1">Customers</h1>
        </div>
        <Link
          to="/customers/new"
          className="rounded-full bg-white text-black px-5 py-2.5 text-sm font-medium hover:bg-zinc-200 transition"
        >
          + Add Customer
        </Link>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
        {loading ? (
          <p className="text-zinc-500 text-sm p-6">Loading customers...</p>
        ) : customers.length === 0 ? (
          <p className="text-zinc-600 text-sm p-6">No customers yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-white/10 text-zinc-600 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Balance</th>
                  <th className="py-3 px-4">Support Ticket</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer._id} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                    <td className="py-3 px-4 font-medium text-white">{customer.name}</td>
                    <td className="py-3 px-4 text-zinc-400">{customer.email}</td>
                    <td className="py-3 px-4 text-zinc-400 capitalize">{customer.customerType}</td>
                    <td className="py-3 px-4 text-zinc-400">₹{customer.outstandingBalance}</td>
                    <td className="py-3 px-4">
                      {customer.hasActiveSupportTicket ? (
                        <span className="text-[10px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-1 rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-700">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 space-x-3">
                      <Link to={`/customers/${customer._id}/edit`} className="text-zinc-400 hover:text-white transition">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(customer._id)}
                        className="text-zinc-500 hover:text-red-400 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerList;