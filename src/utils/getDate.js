// * Getting the date and time format accoring to the user's native language
const getDate = (date, options, language = navigator.language) =>
  new Intl.DateTimeFormat(language, options).format(date);

export default getDate;
