import { UserList } from '@presentation/components/modules/users/UserList';

export const metadata = {
  title: 'Users - Clean Architecture Next.js App Router',
};

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Users Overview</h1>
      <UserList />
    </div>
  );
}

