import Router from "./base";

export default class HistoryRouter extends Router {
  routes: any;
  subscribers: any[];
  constructor() {
    super();
    this.routes = {};
    this.subscribers = [];
    this._watch();
    this._listen();
  }
  _listen() {
    let name = "pathChanged";
    document.addEventListener(name, (e: CustomEvent) => {
      let detail = e.detail;

      let middlewares = this.getRoute(detail.path);

      if (middlewares.length) {
        let index = 0;
        let prev = {};
        const recur = (middlewares, payload) => {
          if (middlewares.length > index) {
            let middleware = middlewares[index];
            prev = middleware(payload, (data) => {
              index++;
              recur(middlewares, { ...payload, ...data });
            });
          }

          if (middlewares.length - 1 == index) {
            history.pushState(detail, window["title"], detail.path);
            this._notifySubscriber(detail);
          }
        };

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
}
