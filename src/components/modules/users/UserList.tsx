"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCw, UserCheck, Shield } from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
}

const initialUsers: UserItem[] = [
  {
    id: "1",
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    role: "admin",
    createdAt: "2026-10-01",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    role: "user",
    createdAt: "2026-10-05",
  },
  {
    id: "3",
    name: "Michael Scott",
    email: "michael.scott@example.com",
    role: "user",
    createdAt: "2026-10-08",
  },
];

export const UserList: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setUsers([...initialUsers]);
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-xl">User Management</CardTitle>
          <CardDescription>
            Manage and view registered users in your application
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RotateCw
            className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {users.map((user) => (
            <div
              key={user.id}
              className="py-4 flex items-center justify-between first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-semibold text-sm text-zinc-700 dark:text-zinc-300">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                    {user.name}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  {user.role === "admin" ? (
                    <Shield className="h-3 w-3 text-blue-500" />
                  ) : (
                    <UserCheck className="h-3 w-3 text-emerald-500" />
                  )}
                  {user.role}
                </span>
                <span className="text-xs text-zinc-400">
                  {user.createdAt}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

