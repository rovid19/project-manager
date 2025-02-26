import { userStore } from "../Store/UserStore";
import { BaseApi } from "./ApiService";

export class AuthService extends BaseApi {
  async loginUser() {
    const currentState = userStore.getState();
    await this.post({
      username: currentState.username,
      password: currentState.password,
    });
  }

  async registerUser() {
    const currentState = userStore.getState();
    await this.post({
      username: currentState.username,
      email: currentState.email,
      password: currentState.password,
    });
  }
}
