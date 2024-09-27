import HashRouter from "./hash";
import HistoryRouter from "./history";

export const create = (type) => {
  switch (type) {
    case "hash":
      return new HashRouter();
    case "history":
      return new HistoryRouter();
    default:
      return new HashRouter();
  }
};
