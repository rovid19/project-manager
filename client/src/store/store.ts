type State = {
  currentUser: string | null;
  theme: "light" | "dark";
  mainDivApp: HTMLElement | null;
  mainSection: HTMLElement | null;
  activeLink: string;
  // Add more state properties as needed
};

class Store {
  private static instance: Store;
  private state: State = {
    currentUser: null,
    theme: "light",
    mainDivApp: document.querySelector("#app"),
    mainSection: null,
    activeLink: "dasboard",
  };
  private listeners: { [key: string]: Function[] } = {};

  private constructor() {}

  static getInstance(): Store {
    if (!Store.instance) {
      Store.instance = new Store();
    }
    return Store.instance;
  }

  getState(): State {
    return this.state;
  }

  setState(newState: Partial<State>) {
    this.state = { ...this.state, ...newState };
    Object.keys(newState).forEach((key) => {
      this.notify(key);
    });
  }

  subscribe(listener: Function, key: string) {
    if (!this.listeners[key]) {
      this.listeners[key] = [listener];
    }
  }

  notify(key: string) {
    if (this.listeners[key]) {
      this.listeners[key].forEach((listener) => {
        listener(this.state);
      });
    }
  }
}

export const store = Store.getInstance();
