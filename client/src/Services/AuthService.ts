import { userStore } from "../Store/UserStore";
import { redirectToHome } from "../Utils/Helpers";
import { BaseApi } from "./ApiService";

export class AuthService extends BaseApi {
  async getUser() {
    try {
      const result = await this.get();
      console.log(result);
      if (result.username.length > 1) {
        userStore.setState({
          username: result.username,
          email: result.email,
        });
      }
      console.log(userStore.getState());
    } catch (e) {
      throw e;
    }
  }
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

      localStorage.setItem("token", result.user[0].token);
      redirectToHome();
    } catch (e: any) {
      throw e;
    }
  }

  async registerUser() {
    try {
      const currentState = userStore.getState();
      console.log(currentState);
      const result = await this.post({
        username: currentState.username,
        email: currentState.email,
        password: currentState.password,
      });
      console.log(result);
      userStore.setState({
        username: result.username,
        email: result.email,
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
