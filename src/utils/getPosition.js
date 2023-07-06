// * Building a promise for using the geolocation coordinates
const getPosition = () =>
  new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));

export default getPosition;
