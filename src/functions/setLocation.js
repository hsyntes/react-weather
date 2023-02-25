const setLocation = (address) => {
  let location;

  if (address.province || address.city)
    location = address.province || address.city;
  else location = address.country;

  if (address.town || address.county)
    location += `/${address.town || address.county}`;

  if (!address.province && !address.city && !address.town && !address.city)
    location = address.region;

  return location;
};

export default setLocation;
