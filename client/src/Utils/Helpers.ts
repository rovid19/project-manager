export function createElement({
  tag,
  children,
  className,
  text,
  onClick,
  onChange,
  name,
  ...props
}: any) {
  // Handle element creation
  const element = document.createElement(tag);
  if (className) element.classList.add(className);
  if (text) element.innerText = text;
  if (name) element.name = name;
  Object.assign(element, props);

  // Handle event listeners
  if (onClick) element.onclick = onClick;

  if (onChange) element.onChange = onChange;

  // Handle children separately
  if (children) {
    children.forEach((child: any) => {
      if (child instanceof HTMLElement) element.appendChild(child);
    });
  }

  return element;
}
