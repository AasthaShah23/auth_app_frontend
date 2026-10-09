'use client';

import React from 'react';
import { useUsers } from '../../../hooks/useUsers';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { formatDate } from '@shared/utils/formatters';

export const UserList: React.FC = () => {
  const { users, isLoading, error, refresh } = useUsers();

  if (isLoading) {
    return (
      <Card title="Users List">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Error">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={refresh} variant="outline" size="sm">
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <Card title="User Management (Clean Architecture Demo)">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Fetched via Domain Use Case (`GetUsersUseCase`) & Infrastructure Repository (`UserRepositoryImpl`)
        </p>
        <Button onClick={refresh} variant="outline" size="sm">
          Refresh List
        </Button>
      </div>

      <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {users.map((user) => (
          <div key={user.id} className="py-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">{user.name}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{user.email}</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 capitalize font-mono">
                {user.role}
              </span>
              <span className="text-zinc-400">
                Created {formatDate(user.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

