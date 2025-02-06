import { createElement } from "../Global/helpers";

export function createMainSection() {
  const mainSection = createElement({ tag: "section", class: "main-section" });
  document.body.appendChild(mainSection);
}
