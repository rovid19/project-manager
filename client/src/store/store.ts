type State = {
  currentUser: string | null;
  theme: "light" | "dark";
  mainDivApp: HTMLElement | null;
  // Add more state properties as needed
};

class Store {
  private static instance: Store;
  private state: State = {
    currentUser: null,
    theme: "light",
    mainDivApp: document.querySelector("#app"),
  };

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
    this.notify();
  }

  private listeners: Function[] = [];

  subscribe(listener: Function) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }
}

export const store = Store.getInstance();
