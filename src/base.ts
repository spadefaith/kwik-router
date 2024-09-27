const Base = class {
  routes: any;
  subscribers: any[];
  constructor() {
    this.routes = {};
    this.subscribers = [];
  }
  build(ctx) {
    let defaultPath = ctx.defaultPath;

    this._registerSubscriber(ctx.onChange);

    this.goTo(defaultPath || window.location.pathname);
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

  _registerSubscriber(callback) {
    if (callback) {
      this.subscribers.push(callback);
    }
  }
  _notifySubscriber(payload) {
    this.subscribers.forEach((sub) => {
      sub(payload);
    });
  }
};

export default Base;
