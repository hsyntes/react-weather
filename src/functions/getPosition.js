const getPosition = () =>
  new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));

export default getPosition;
