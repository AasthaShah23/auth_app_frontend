import React from "react";
import { UserList } from "@/components/modules/users/UserList";

export const metadata = {
  title: "Users Management - Clean Architecture Next.js",
  description: "Manage users in dashboard",
};

export default function UsersDashboardPage() {
  return (
    <div className="space-y-6">
      <UserList />
    </div>
  );
}
