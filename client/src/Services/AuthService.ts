import { userStore } from "../Store/UserStore";
import { redirectToHome } from "../Utils/Helpers";
import { BaseApi } from "./BaseService";

export class AuthService extends BaseApi {
  async getUser() {
    const result = await this.get();
    console.log(result);
    if (!result.error) {
      userStore.setState({
        username: result.username,
        email: result.email,
        userId: result.userId,
      });
    } else {
      console.log("yes");
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

      userStore.setState({
        username: result.username,
        email: result.email,
      });

      redirectToHome();
    } catch (e) {
      throw e;
    }
  }
}
