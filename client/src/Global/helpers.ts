export function createElement({ tag, class: className, text, ...props }: any) {
  const element = document.createElement(tag);
  if (className) element.classList.add(className);
  if (text) element.innerText = text;
  Object.assign(element, props);
  return element;
}
