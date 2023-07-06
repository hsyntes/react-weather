import { json } from "react-router-dom";

// * Refactoring the fetching data
const fetchData = async (api) => {
  const response = await fetch(api);

  if (!response.ok)
    throw json(
      { message: "Sorry, couldn't fetch the weather data." },
      { status: response.status }
    );

  const data = await response.json();

  return data;
};

export default fetchData;
