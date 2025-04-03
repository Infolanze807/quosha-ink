import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./App.scss";
import Layout from "./components/layouts/Layout";
import Loader from "./components/components/Loader/Loader";

function App() {
  const [loading, setLoading] = useState(true);
  const [transition, setTransition] = useState(true);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    // Detect page reload and redirect to home
    if (performance.navigation.type === 1) { // Check if the page was reloaded
      navigate("/"); // Redirect to the home page
    }

    const timer = setTimeout(() => {
      setTransition(false);
      setTimeout(() => {
        setLoading(false);
      }, 700);
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      {loading && <Loader transition={transition} />}
      <div className={loading ? 'hidden' : ''}>
        <Layout />
      </div> 
    </>
  );
}

export default App;
