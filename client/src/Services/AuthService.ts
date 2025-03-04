import { userStore } from "../Store/UserStore";
import { redirectToHome } from "../Utils/Helpers";

import { BaseApi } from "./ApiService";

export class AuthService extends BaseApi {
  async loginUser() {
    const currentState = userStore.getState();
    try {
      const result = await this.post({
        username: currentState.username,
        password: currentState.password,
      });

      userStore.setState({
        username: result.user[0].username,
        email: result.user[0].email,
      });

      redirectToHome();
    } catch (e: any) {
      throw e;
    }
  }

  async registerUser() {
    try {
      const currentState = userStore.getState();
      const result = await this.post({
        username: currentState.username,
        email: currentState.email,
        password: currentState.password,
      });

      this.saveTokenToLocalStorage(result.token);
      redirectToHome();
    } catch (e) {
      throw e;
    }
  }

  saveTokenToLocalStorage(token: string) {
    const existingToken = localStorage.getItem("token");
    if (existingToken) {
      localStorage.removeItem("token");
    }

    localStorage.setItem("token", token);
  }
}
