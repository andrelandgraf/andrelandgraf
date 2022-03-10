const getFocusClasses = (smaller = false) =>
  `outline-none focus:ring-primary ${smaller ? 'focus:ring-2' : 'focus:ring-4'}`;

const getHoverClasses = (smaller = false) =>
  `outline-none hover:ring-primary ${smaller ? 'hover:ring-2' : 'hover:ring-4'}`;

const getAriaClasses = (smaller = false) => `${getFocusClasses(smaller)} ${getHoverClasses(smaller)}`;

export { getFocusClasses, getHoverClasses, getAriaClasses };
