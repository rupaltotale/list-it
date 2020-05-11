let globalStylesheet;
export default globalStylesheet = {
  primaryColor: null,
  backgroundColor: null,
  body: (primaryColor, backgroundColor) => {
    globalStylesheet.primaryColor = primaryColor;
    globalStylesheet.backgroundColor = backgroundColor;
    return globalStylesheet.app();
  },
  app: () => {
    return {
      color: globalStylesheet.primaryColor,
      backgroundColor: globalStylesheet.backgroundColor,
    };
  },
};
