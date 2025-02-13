type State = {
  currentUser: string | null;
  theme: "light" | "dark";
  mainDivApp: HTMLElement | null;
  mainSection: HTMLElement | null;
  activeLink: string;
  previousActiveLink: string;
};

export class Store {
  // private static instance: Store;
  private state: any = {};
  private listeners: { [key: string]: Function[] } = {};

  constructor(initialState: any = {}) {
    this.state = initialState;
  }

  /* static getInstance(): Store {
    if (!Store.instance) {
      Store.instance = new Store();
    }

    return Store.instance;
  }*/

  getState(): State {
    return this.state;
  }

  setState(newState: Partial<State>) {
    this.state = { ...this.state, ...newState };
    this.notify(newState);
  }

  subscribe(listener: Function, key: string) {
    if (!this.listeners[key]) {
      this.listeners[key] = [listener];
    }
  }

  notify(newState: Partial<State>) {
    const key = Object.keys(newState)[0];
    // console.log(Object.entries(this.listeners));

    Object.entries(this.listeners).forEach((state) => {
      if (state[0] === key) {
        state[1].forEach((listener) => {
          listener();
        });
      }
    });
  }
}

// singleton pattern
//export const store = Store.getInstance();

// singleton pattern mi zadaje velike glavobolje

export const store = new Store({
  currentUser: null,
  theme: "light",
  mainDivApp: document.querySelector("#app"),
  mainSection: null,
  activeLink: "dasboard",
  previousActiveLink: "",
});
