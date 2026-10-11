import { IProfileRepository } from "@/domain/repositories/profile.repository";
import { HttpClient } from "../api/http-client";
import { ProfileDTO } from "../dtos/profile.dto";

export class ProfileRepositoryImpl implements IProfileRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async getProfile(): Promise<ProfileDTO> {
    const response = await this.httpClient.get<ProfileDTO>("/profile/me");
    return response;
  }
}
