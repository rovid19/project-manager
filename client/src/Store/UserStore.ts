import { Store } from "./Store";

class UserStore extends Store {
  constructor(initialState: any) {
    super();
  }
}

export const userStore = new UserStore({
  username: "null",
  email: "null",
  password: "",
  teams: "",
});
