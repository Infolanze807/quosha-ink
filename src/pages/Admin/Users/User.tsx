import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FaSpinner, FaExclamationCircle, FaInfoCircle, FaUserShield, FaUser } from "react-icons/fa"; // Import icons
interface User {
  _id: string;
  name: string;
  email: string;
  phonenumber: string;
  role: string;
}

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const APIURL = import.meta.env.VITE_APP_API_URL;

  useEffect(() => {
    fetchUserList();
  }, []);

  const fetchUserList = async () => { 
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${APIURL}printful/users`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data.usersList || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewOrders = (userId: string, userName: string) => {
    navigate(`/admin/orders/${userId}`, {
      state: { userName },
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">User List</h2>

        {isLoading ? (
          <div className="text-center text-gray-600 flex flex-col items-center">
            <FaSpinner className="animate-spin text-4xl mb-2" />
            <p>Loading users...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 flex flex-col items-center">
            <FaExclamationCircle className="text-4xl mb-2" />
            <p>{`Error: ${error}`}</p>
          </div>
        ) : users.length > 0 ? (
          <div className="space-y-4">
            {users.map((user, index) => (
              <div
                key={user._id}
                className={`flex items-center justify-between p-6 rounded-lg shadow-md ${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-gray-600">{user.phonenumber}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-4 py-2 rounded-full flex items-center ${
                      user.role === "Admin"
                        ? "bg-blue-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {user.role === "Admin" ? <FaUserShield className="mr-2" /> : <FaUser className="mr-2" />}
                    {user.role}
                  </span>
                  <button
                    onClick={() => handleViewOrders(user._id, user.name)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300"
                  >
                    View Orders
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500 flex flex-col items-center">
            <FaInfoCircle className="text-4xl mb-2" />
            <p>No users found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
