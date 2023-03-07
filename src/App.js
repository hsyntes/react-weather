import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import RootLayout from "./pages/Root";
import ErrorPage from "./pages/Error";
import HomePage from "./pages/Home";
import { loader as weatherLoader } from "./pages/Root";
import Spinner from "./components/Spinner";

const DailyWeatherDetailPage = lazy(() => import("./pages/DailyWeatherDetail"));
const SearchedCityDetailPage = lazy(() => import("./pages/SearchedCityDetail"));

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
    element: (
      <Suspense fallback={<Spinner />}>
        <SearchedCityDetailPage />
      </Suspense>
    ),
    loader: ({ params }) =>
      import("./pages/SearchedCityDetail").then((module) =>
        module.loader({ params })
      ),
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
