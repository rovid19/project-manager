import { createElement } from "../Utils/Helpers";
import { store } from "../store/Store";
import "../Styles/MainContent.css";

export function createMainContent() {
  const currentState = store.getState();
  const mainSection = createElement({
    tag: "section",
    className: "main-section",
  });
  store.setState({ mainSection: mainSection });
  currentState.mainDivApp?.appendChild(mainSection);
}
