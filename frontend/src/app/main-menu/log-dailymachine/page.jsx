// src/app/main-menu/log-dailymachine/page.jsx

"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  CheckCircle,
  XCircle,
  ClipboardCheck,
  Clock,
  AlertCircle,
  Filter,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { useDarkMode } from "../../components/DarkModeProvider";
import { formatDate } from "../../components/dateFormatter";

// Utility function to format date to DD/MM/YYYY
const formatDisplayDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const LogDailyMachinePage = () => {
  const { user } = useAuth();
  const { darkMode } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("all");
  const [selectedFamily, setSelectedFamily] = useState("all");
  const [error, setError] = useState(null);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch initial data when component mounts
  useEffect(() => {
    const loadData = async () => {
        try {
            await fetchMachines();
        } catch (err) {
            if (err.response) {
                setError(`Server Error: ${err.response.data.message || 'Something went wrong'}`);
            } else if (err.request) {
                setError("Cannot connect to server. Please check your connection.");
            } else {
                setError("Failed to load machine data. Please try again later.");
            }
            setLoading(false);
        }
    };

    loadData();
}, []);

  const fetchMachines = async () => {
    try {
        setLoading(true);
        setError(null);
        
        const response = await fetch("/api/inspections", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch machines");
        }

        const data = await response.json();

        // จัดการข้อมูลที่ได้รับ
        const formattedData = data.map(item => ({
            id: item.id,
            machine_name: item.machine_name,
            machine_no: item.machine_no,
            model: item.model,
            customer: item.customer,
            family: item.family,
            last_check: item.last_check,
            status: item.status,
            checked_by: item.checked_by
        }));

        setMachines(formattedData);

        // Get today's date without time
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter for today's data
        const todayData = formattedData.filter((machine) => {
            const checkDate = new Date(machine.last_check);
            checkDate.setHours(0, 0, 0, 0);
            return checkDate.getTime() === today.getTime();
        });

        setFilteredResults(todayData);
        setIsSearching(true);
    } catch (err) {
        setError(err.message);
        setFilteredResults([]);
    } finally {
        setLoading(false);
    }
};

  // Get unique values for dropdowns
  const getCustomers = () => {
    const defaultCustomers = ["all", "ista"];
    const uniqueCustomers = [...new Set(machines.map((m) => m.customer))];
    const filteredCustomers = uniqueCustomers.filter(
      (c) => !defaultCustomers.includes(c)
    );
    return defaultCustomers.concat(filteredCustomers).sort();
  };

  const getFamilies = () => {
    const defaultFamilies = ["all", "HCA", "TSS", "WMM"];
    const uniqueFamilies = [...new Set(machines.map((m) => m.family))];
    const filteredFamilies = uniqueFamilies.filter(
      (f) => !defaultFamilies.includes(f)
    );
    return defaultFamilies.concat(filteredFamilies).sort();
  };

  const filterMachines = () => {
    const filtered = machines.filter((machine) => {
      const matchesSearch =
        machine.machine_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        machine.machine_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        machine.model.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCustomer =
        selectedCustomer === "all" || machine.customer === selectedCustomer;

      const matchesFamily =
        selectedFamily === "all" || machine.family === selectedFamily;

      let isInDateRange = true;
      if (startDate || endDate) {
        // เช็คว่ามีการเลือกวันที่หรือไม่
        const checkDate = new Date(machine.last_check);
        checkDate.setHours(0, 0, 0, 0);

        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          isInDateRange = isInDateRange && checkDate >= start;
        }

        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          isInDateRange = isInDateRange && checkDate <= end;
        }
      }

      return matchesSearch && matchesCustomer && matchesFamily && isInDateRange;
    });

    setFilteredResults(filtered);
    setIsSearching(true);
  };

  // Handle search
  const handleSearch = () => {
    filterMachines();
  };

  // Reset filters
  const handleReset = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setSelectedCustomer("all");
    setSelectedFamily("all");
    setFilteredResults(machines);
    setIsSearching(true);
    setError(null);
  };

  // Styling classes
  const cardClass = `p-6 rounded-lg shadow-md ${
    darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
  }`;

  const inputClass = `w-full px-3 py-2 border rounded-md ${
    darkMode
      ? "bg-gray-700 border-gray-600 text-white"
      : "bg-gray-100 border-gray-300 text-gray-900"
  } focus:outline-none`;

  const selectClass = `w-full px-3 py-2 border rounded-md ${
    darkMode
      ? "bg-gray-700 border-gray-600 text-white"
      : "bg-gray-100 border-gray-300 text-gray-900"
  } focus:outline-none`;

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "pass":
        return <CheckCircle className="text-green-500" />;
      case "fail":
        return <XCircle className="text-red-500" />;
      case "idle":
        return <AlertCircle className="text-yellow-500" />;
      default:
        return <AlertCircle className="text-gray-500" />;
    }
  };

  // Get statistics
  const getStats = () => {
    const stats = {
      total: filteredResults.length,
      pass: filteredResults.filter((m) => m.status.toLowerCase() === "pass")
        .length,
      fail: filteredResults.filter((m) => m.status.toLowerCase() === "fail")
        .length,
      idle: filteredResults.filter((m) => m.status.toLowerCase() === "idle")
        .length,
    };
    return stats;
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-100"} p-8`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <ClipboardCheck
              className={`w-8 h-8 ${
                darkMode ? "text-blue-400" : "text-blue-500"
              }`}
            />
            <h2
              className={`text-3xl font-extrabold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Daily Machine Inspection Log
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <Clock className="w-6 h-6" />
            <span>{formatDate(new Date())}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className={cardClass}>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div
              className={`p-4 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-50"
              }`}
            >
              <p className="text-sm font-medium mb-1">Total Inspections</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div
              className={`p-4 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-50"
              }`}
            >
              <p className="text-sm font-medium mb-1">Pass</p>
              <p className="text-2xl font-bold text-green-500">{stats.pass}</p>
            </div>
            <div
              className={`p-4 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-50"
              }`}
            >
              <p className="text-sm font-medium mb-1">Fail</p>
              <p className="text-2xl font-bold text-red-500">{stats.fail}</p>
            </div>
            <div
              className={`p-4 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-50"
              }`}
            >
              <p className="text-sm font-medium mb-1">Idle</p>
              <p className="text-2xl font-bold text-yellow-500">{stats.idle}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search machine name/no/model..."
                  className={`${inputClass} pl-10`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Customer Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <select
                  className={`${selectClass} pl-10`}
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                >
                  {getCustomers().map((customer, index) => (
                    <option
                      key={`customer-${index}-${customer}`}
                      value={customer}
                    >
                      {customer === "all" ? "All Customers" : customer}
                    </option>
                  ))}
                </select>
              </div>

              {/* Family Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <select
                  className={`${selectClass} pl-10`}
                  value={selectedFamily}
                  onChange={(e) => setSelectedFamily(e.target.value)}
                >
                  {getFamilies().map((family, index) => (
                    <option key={`family-${index}-${family}`} value={family}>
                      {family === "all" ? "All Families" : family}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  className={`${inputClass} pl-10`}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  className={`${inputClass} pl-10`}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Search and Reset Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleReset}
                className={`px-6 py-2.5 rounded-md border border-gray-300 
                  ${
                    darkMode
                      ? "text-gray-200 hover:bg-gray-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }
                  transition-colors flex items-center gap-2 text-sm font-medium`}
              >
                <XCircle className="w-4 h-4" />
                Reset Filters
              </button>
              <button
                onClick={handleSearch}
                className={`px-6 py-2.5 rounded-md bg-blue-500 text-white hover:bg-blue-600 
                  transition-colors flex items-center gap-2 text-sm font-medium
                  ${darkMode ? "hover:bg-blue-700" : "hover:bg-blue-600"}
                  disabled:bg-gray-400 disabled:cursor-not-allowed`}
                disabled={loading}
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 mb-6 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
              <p>Error: {error}</p>
            </div>
          )}

          {/* Machines Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Machine Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Machine No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Family
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Check Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Checked By
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredResults.map((machine) => (
                  <tr
                    key={machine.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {machine.machine_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {machine.machine_no}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {machine.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {machine.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {machine.family}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDisplayDate(machine.last_check)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(machine.status)}
                        <span
                          className={
                            machine.status.toLowerCase() === "pass"
                              ? "text-green-500"
                              : machine.status.toLowerCase() === "fail"
                              ? "text-red-500"
                              : machine.status.toLowerCase() === "idle"
                              ? "text-yellow-500"
                              : "text-gray-500"
                          }
                        >
                          {machine.status.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {machine.checked_by}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* No Results Message */}
            {isSearching && filteredResults.length === 0 && (
              <div className="text-center py-4">
                <p
                  className={`text-lg ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  No machines found matching your search criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogDailyMachinePage;
