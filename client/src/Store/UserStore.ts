import { Project } from "../Types/ProjectsTypes";
import { Team } from "../Types/TeamsTypes";
import { Store } from "./Store";

export type UserStoreType = {
  username: string;
  email: string;
  teams: Team[];
  projects: Project[];
  userId: string;
};

class UserStore extends Store {
  constructor(initialState: UserStoreType) {
    super(initialState);
  }
}

export const userStore = new UserStore({
  username: "",
  email: "",
  teams: [],
  projects: [{ title: "", description: "", icon: "", projectId: "" }],
  userId: "",
});
