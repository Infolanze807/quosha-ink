import React, { useState } from "react";
import UserList from "./Users/User";
import { FaBars, FaUsers } from "react-icons/fa6";
import { BsCartCheckFill } from "react-icons/bs"; // Ensure this import exists
import { MdOutlineCancel } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router";

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedOption, setSelectedOption] = useState("userlist");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("Name");
      localStorage.removeItem("cart");
      localStorage.removeItem("totalQuantity");
      window.location.reload();
      navigate("/");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-80" : "w-28"
        } bg-gray-800 text-white transition-all duration-300 flex-shrink-0`}
      >
        <div className="flex justify-between items-center p-6 bg-gray-900 text-white">
          <h1
            className={`text-2xl font-bold tracking-wide ${
              !isSidebarOpen && "hidden"
            }`}
          >
            Admin Panel
          </h1>
          <button
            className="bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition-all duration-300"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? (
              <MdOutlineCancel size={24} />
            ) : (
              <FaBars size={24} />
            )}
          </button>
        </div>

        {isSidebarOpen && (
          <ul className="mt-4 space-y-2">
            <li
              className={`${
                selectedOption === "userlist"
                  ? "bg-blue-500"
                  : "hover:bg-gray-700"
              } px-6 py-4 cursor-pointer flex items-center`}
              onClick={() => setSelectedOption("userlist")}
            >
              <FaUsers className="mr-2" size={20} />
              {isSidebarOpen && <span>User List</span>}
            </li>
            <li
              className={`${
                selectedOption === "orderlist"
                  ? "bg-blue-500"
                  : "hover:bg-gray-700"
              } px-6 py-4 cursor-pointer flex items-center`}
              onClick={() => setSelectedOption("orderlist")}
            >
              <BsCartCheckFill className="mr-2" size={20} />
              {isSidebarOpen && <span>Order List</span>}
            </li>
            <li
              className="hover:bg-gray-700 px-6 py-4 cursor-pointer flex items-center"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="mr-2" size={20} />
              {isSidebarOpen && <span>Logout</span>}
            </li>
          </ul>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
        {selectedOption === "userlist" && <UserList />}
        {selectedOption === "orderlist" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Order List</h2>
            <p>Display the list of orders here...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
