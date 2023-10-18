const replaceState = (url: string) => {
  window.history.replaceState(null, '', url);
};

export { replaceState };
