import { BaseApi } from "./ApiService";

export class AuthService extends BaseApi {
  async loginUser() {
    const userData = await this.post({});
  }
}
