import { Routes, Route } from "react-router-dom";
import { RegistryProvider } from "./contexts/RegistryContext.tsx";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";
import Layout from "./components/Layout.tsx";
import Home from "./pages/Home.tsx";
import Repository from "./pages/Repository.tsx";
import ImageDetails from "./pages/ImageDetails.tsx";
import About from "./pages/About.tsx";

function App() {
  return (
    <ThemeProvider>
      <RegistryProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/repository/:name" element={<Repository />} />
            <Route
              path="/repository/:name/tag/:tag"
              element={<ImageDetails />}
            />
          </Routes>
        </Layout>
      </RegistryProvider>
    </ThemeProvider>
  );
}

export default App;
