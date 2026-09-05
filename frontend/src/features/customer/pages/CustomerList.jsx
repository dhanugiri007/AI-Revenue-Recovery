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
    return (
      <p className="text-center mt-10 text-gray-500">
        Set up your company first before adding customers.
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Customers</h2>
        <Link
          to="/customers/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Customer
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading customers...</p>
      ) : customers.length === 0 ? (
        <p className="text-gray-500">No customers yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Balance</th>
                <th className="py-2 pr-4">Support Ticket</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 pr-4 font-medium">{customer.name}</td>
                  <td className="py-2 pr-4">{customer.email}</td>
                  <td className="py-2 pr-4 capitalize">{customer.customerType}</td>
                  <td className="py-2 pr-4">₹{customer.outstandingBalance}</td>
                  <td className="py-2 pr-4">
                    {customer.hasActiveSupportTicket ? (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="py-2 pr-4 space-x-3">
                    <Link
                      to={`/customers/${customer._id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(customer._id)}
                      className="text-red-500 hover:underline"
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
  );
};

export default CustomerList;