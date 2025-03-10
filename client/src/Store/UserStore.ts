import { Store } from "./Store";
export type UserStoreType = {
  username: string;
  email: string;
  teams: number;
  projects: UserProject[];
};

export type UserProject = {
  title: string;
  description: string;
  icon: string;
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
  projects: [{ title: "", description: "", icon: "" }],
});
