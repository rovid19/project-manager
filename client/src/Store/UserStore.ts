import { Store } from "./Store";

type UserState = {
  username: string;
  email: string;
};

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
