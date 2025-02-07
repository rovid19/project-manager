export function createElement({
  tag,
  children,
  className,
  text,
  onClick,
  ...props
}: any) {
  // Handle element creation
  const element = document.createElement(tag);
  if (className) element.classList.add(className);
  if (text) element.innerText = text;
  Object.assign(element, props);

  // Handle event listeners
  if (onClick) element.onclick = onClick;

  // Handle children separately
  if (children) {
    children.forEach((child: any) => element.appendChild(child));
  }

  return element;
}
