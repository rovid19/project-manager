import { createElement } from "../Utils/Helpers";
import { store } from "../Store/Store";
import "../Styles/MainContent.css";

export function createMainContent() {
  const currentState = store.getState();
  const mainSection = createElement({
    tag: "section",
    className: "main-section",
  });
  currentState.mainDivApp?.appendChild(mainSection);
}
