import { Project } from "../Types/ProjectsTypes";
import { Team } from "../Types/TeamsTypes";

type setState = {
  [key: string]:
    | string
    | HTMLElement
    | null
    | Project[]
    | Team[]
    | { [key: string]: string };
};

export class Store {
  private state: any = {};
  private listeners: { [key: string]: Function[] } = {};

  constructor(initialState: any = {}) {
    this.state = initialState;
  }

  getState(): any {
    return this.state;
  }

  setState(newState: setState) {
    this.state = { ...this.state, ...newState };
    this.notify(newState);
  }

  subscribe(listener: Function, key: string) {
    if (!this.listeners[key]) {
      this.listeners[key] = [listener];
    }
  }

  unsubscribe(/*listener: Function,*/ key: string) {
    if (this.listeners[key]) {
      this.listeners[key] = [];
      delete this.listeners[key];
    }
  }

  notify(newState: setState) {
    const key = Object.keys(newState)[0];

    Object.entries(this.listeners).forEach((state) => {
      if (state[0] === key) {
        state[1].forEach((listener) => {
          listener();
        });
      }
    });
  }
}

export const store = new Store({
  currentUser: null,
  theme: "light",
  mainDivApp: document.querySelector("#app"),
  mainSection: null,
  activeLink: "dashboard",
  previousActiveLink: "",
  isAuth: false,
  tasksFilterStatus: {},
});
