import { GetUsersUseCase } from '@domain/usecases/get-users.usecase';
import { LoginUseCase } from '@domain/usecases/login.usecase';
import { httpClient } from '../api/http-client';
import { UserRepositoryImpl } from '../repositories/user.repository.impl';

/**
 * Dependency Injection Container / Service Locator
 * Instantiates repositories & use cases for injection across application layers.
 */
class Container {
  // Repositories
  private _userRepository = new UserRepositoryImpl(httpClient);

  // Use Cases
  public getUsersUseCase = new GetUsersUseCase(this._userRepository);
  // public loginUseCase = new LoginUseCase(this._authRepository);
}

export const container = new Container();

