import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import RootLayout from "./pages/Root";
import ErrorPage from "./pages/Error";
import HomePage from "./pages/Home";
import DailyWeatherDetailPage from "./pages/DailyWeatherDetail";
import SearchedCityDetailPage from "./pages/SearchedCityDetail";
import { loader as weatherLoader } from "./pages/Root";
import { loader as searchedWeatherLoader } from "./pages/SearchedCityDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    loader: weatherLoader,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "daily-weather/:dailyWeatherDetail",
        element: <DailyWeatherDetailPage />,
      },
    ],
  },
  {
    path: "search/:searchedCityDetail",
    element: <SearchedCityDetailPage />,
    loader: searchedWeatherLoader,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "daily-weather/:dailyWeatherDetail",
        element: <DailyWeatherDetailPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
