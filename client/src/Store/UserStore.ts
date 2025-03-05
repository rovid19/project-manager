import { Store } from "./Store";
export type UserStoreType = {
  username: string;
  email: string;
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
  teams: 0,
});
