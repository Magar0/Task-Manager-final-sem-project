import { useEffect, useState } from "react";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import { useDispatch } from "react-redux";
import { initializeAuth } from "./store/slices/authSlice";
import AuthRoute from "./routes/AuthRoutes";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Profile from "./pages/Profile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: Infinity,
    },
    mutations: {
      retry: 0,
    },
  },
});

function App() {
  const dispatch = useDispatch();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    dispatch(initializeAuth());
    setIsAuthChecked(true);
  }, [dispatch]);

  if (!isAuthChecked) {
    return <div>Loading auth...</div>;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Auth routes */}
          <Route element={<AuthRoute />}>
            <Route path="/sign-in" element={<Login />} />
            <Route path="/sign-up" element={<Signup />} />
          </Route>

          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Navbar />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="profile" element={<Profile />} />
              {/* Add more protected routes here */}
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
