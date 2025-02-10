type Routes = {
  [key: string]: { controller: string; controllerMethod: string };
};

export class Router {
  routes: Routes = {};
  controller: any = {};

  constructor(routes: string[]) {
    this.registerRoutes(routes);
  }

  registerRoutes(routes: string[]): void {
    routes.forEach((route: string) => {
      const routeArray = route.slice(1).split("/");
      this.routes[routeArray[0]] = {
        controller: routeArray[1],
        controllerMethod: routeArray[2],
      };
    });
  }

  route(uri: string = ""): void {
    const path = uri.length > 0 ? uri : window.location.pathname.slice(1);

    Object.entries(this.routes).forEach((route: any) => {
      if (path.toUpperCase() === route[0].toUpperCase()) {
        this.loadController(route[1].controller, route[1].controllerMethod);
      }
    });
  }

  async loadController(controllerName: string, controllerMethod: string) {
    // obrisi prethodni controller - stoream controller na klasi da ih konstantno brisem i da je samo jedan controller aktivan atm
    if (this.controller) this.controller = {};

    // import module klase, trenutno imam named export, ali moguce je i default loadat samo je malo drugaciji kod onda
    const module = await import(`../Controllers/App/${controllerName}`);

    // tu je kod drugaciji ak loadam default onda mogu accessati ko objekt new module.default, a ko named export je na ovaj nacin
    this.controller = new module[controllerName]();

    // lodanje controllera
    this.controller[controllerMethod]();
  }
}
