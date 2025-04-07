import { MembersData } from "../Controllers/App/ProjectController";
import { Store } from "./Store";
export type UserStoreType = {
  username: string;
  email: string;
  teams: number;
  projects: Project[];
  userId: string;
};

export type ProjectData = {
  project: Project;
  membersData: MembersData[];
};

export type Project = {
  title: string;
  description: string;
  icon: string;
  projectId: string;
  members?: string[];
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
  projects: [{ title: "", description: "", icon: "", projectId: "" }],
  userId: "",
});
