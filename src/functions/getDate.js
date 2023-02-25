const getDate = (date, options, language = navigator.language) =>
  new Intl.DateTimeFormat(language, options).format(date);

export default getDate;
