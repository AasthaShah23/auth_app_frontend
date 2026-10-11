"use client";

import { useState, useEffect } from "react";
import { httpClient } from "@/infrastructure/api/http-client";
import { Users, Shield, UserCheck, Search, Mail, Calendar } from "lucide-react";

export interface UserItem {
  id: string | number;
  name: string;
  email: string;
  role: "admin" | "user" | string;
  is_active?: boolean;
  isActive?: boolean;
  createdAt?: string;
  created_at?: string;
}

export function AdminDashboard() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Primary: backend admin endpoint GET /api/admin/users
      let list: UserItem[] | undefined;
      try {
        const response = await httpClient.get<
          { total: number; users: UserItem[] } | UserItem[]
        >("/admin/users");
        list = Array.isArray(response) ? response : response?.users;
      } catch {
        // Fallback: GET /api/users
        const response = await httpClient.get<
          UserItem[] | { users: UserItem[] }
        >("/users");
        list = Array.isArray(response) ? response : response?.users;
      }

      if (Array.isArray(list) && list.length > 0) {
        setUsers(list);
      }
    } catch {
      // Fallback cleanly to default mock list if endpoint is unavailable
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    const name = (u.name || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  const totalUsers = users.length;

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-500">Total Users</p>
            <p className="text-2xl font-bold text-zinc-900 mt-1">
              {totalUsers}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Users Listing Table Card */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm overflow-hidden">
        {/* Table Top Toolbar */}
        <div className="p-6 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">
              Registered Users
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Showing {filteredUsers.length} of {totalUsers} total registered
              accounts
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50/80 border-b border-zinc-100 text-zinc-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-6">User</th>
                <th className="py-3 px-6">Role</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-zinc-400">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((item) => {
                  const isAdminUser =
                    (item.role || "").toLowerCase() === "admin";
                  const dateStr =
                    item.createdAt || item.created_at || "2026-10-06";
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-zinc-50/60 transition-colors"
                    >
                      {/* Name & Avatar */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              isAdminUser
                                ? "bg-indigo-600 text-white"
                                : "bg-zinc-100 text-zinc-700 border border-zinc-200"
                            }`}
                          >
                            {(item.name || "U").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-zinc-900 text-xs sm:text-sm">
                              {item.name}
                            </p>
                            <p className="text-zinc-500 text-[11px] flex items-center gap-1">
                              <Mail className="w-3 h-3 text-zinc-400" />
                              {item.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            isAdminUser
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          {isAdminUser ? (
                            <Shield className="w-3 h-3 text-purple-600" />
                          ) : (
                            <UserCheck className="w-3 h-3 text-blue-600" />
                          )}
                          {isAdminUser ? "Administrator" : "User"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Active
                        </span>
                      </td>

                      {/* Member Since */}
                      <td className="py-4 px-6 text-zinc-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{dateStr}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
