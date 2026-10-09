import { UserList } from '@presentation/components/modules/users/UserList';
import { Card } from '@presentation/components/common/Card';

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-8 space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Clean Architecture with Next.js
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-zinc-600 dark:text-zinc-400">
          A modular, scalable, and maintainable project structure following Clean Architecture principles (Domain, Infrastructure, Presentation, Shared).
        </p>
      </div>

      {/* Layer Architecture Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="1. Domain Layer">
          <p className="text-xs font-mono text-blue-600 dark:text-blue-400 mb-2">src/domain</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Contains pure business logic: Entities, Repository Interfaces, and Use Cases. Zero external dependencies.
          </p>
        </Card>

        <Card title="2. Infrastructure">
          <p className="text-xs font-mono text-blue-600 dark:text-blue-400 mb-2">src/infrastructure</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Data layer: API clients, DTOs, Mappers, Repository Implementations, and Dependency Injection container.
          </p>
        </Card>

        <Card title="3. Presentation">
          <p className="text-xs font-mono text-blue-600 dark:text-blue-400 mb-2">src/presentation</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            UI layer: Reusable components, Feature modules, Custom Hooks (Presenters), and Application State.
          </p>
        </Card>

        <Card title="4. Shared">
          <p className="text-xs font-mono text-blue-600 dark:text-blue-400 mb-2">src/shared</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Cross-cutting utilities: App configuration, Constants, Error handlers, and Helper functions.
          </p>
        </Card>
      </div>

      {/* Live Demo Component */}
      <div className="mt-8">
        <UserList />
      </div>
    </div>
  );
}
