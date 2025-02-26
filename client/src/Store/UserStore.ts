import { Store } from "./Store";
export type UserStoreType = {
  username: string;
  email: string;
  password: string;
  teams: number;
};

class UserStore extends Store {
  constructor(initialState: UserStoreType) {
    super();
  }
}

export const userStore = new UserStore({
  username: "",
  email: "",
  password: "",
  teams: 0,
});
