import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import RootLayout from "./pages/Root";
import ErrorPage from "./pages/Error";
import HomePage from "./pages/Home";
import SearchedCityDetailPage from "./pages/SearchedCityDetail";
import { loader as weatherLoader } from "./pages/Root";
import { loader as searchedCityLoader } from "./pages/SearchedCityDetail";
import Spinner from "./components/Spinner";

const DailyWeatherDetailPage = lazy(() => import("./pages/DailyWeatherDetail"));

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
        element: (
          <Suspense fallback={<Spinner />}>
            <DailyWeatherDetailPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "search/:searchedCityDetail",
    element: <SearchedCityDetailPage />,
    loader: searchedCityLoader,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "daily-weather/:dailyWeatherDetail",
        element: (
          <Suspense fallback={<Spinner />}>
            <DailyWeatherDetailPage />
          </Suspense>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
