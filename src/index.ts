const Router = class {
  routes: any;
  constructor() {
    this.routes = {};

    this._watch();
    this._listen();
  }
  addRoute(path, ...args) {
    if (!this.routes[path]) {
      this.routes[path] = [];
    }
    this.routes[path] = [...this.routes[path], ...args];
  }
  getRoute(path) {
    return this.routes[path];
  }

  goBack() {
    window.history.back();
  }
  goTo(path) {
    let name = "pathChanged";
    let detail = { path };
    let event = new CustomEvent(name, { detail });
    document.dispatchEvent(event);
  }
  _listen() {
    let name = "pathChanged";
    document.addEventListener(name, (e: CustomEvent) => {
      let detail = e.detail;

      let middlewares = this.getRoute(detail.path);

      if (middlewares.length) {
        let index = 0;
        let prev = {};
        function recur(middlewares, payload) {
          if (middlewares.length > index) {
            let middleware = middlewares[index];
            prev = middleware(payload, (data) => {
              index++;
              recur(middlewares, { ...payload, ...data });
            });
          } else {
            history.pushState(detail, window["title"], detail.path);
          }
        }

        recur(middlewares, { ...detail, ...(prev || {}) });
      }
    });
  }

  _watch() {
    /**
     * ensure that popstate event is only added once
     */
    if (!window["hasRouterPop"]) {
      window.addEventListener("popstate", (e) => {});
      window["hasRouterPop"] = true;
    }
  }
};

export { Router };
