import React, { useState } from "react";
import InitialPage from "./components/InitialPage.jsx";
import InputPage from "./components/InputPage.jsx";

function App() {
  const [currentPage, setCurrentPage] = useState("initial");

  const navigateToInput = () => {
    setCurrentPage("input");
  };

  const navigateToInitial = () => {
    setCurrentPage("initial");
  };

  return (
    <>
      {currentPage === "initial" ? (
        <InitialPage onNavigateToInput={navigateToInput} />
      ) : (
        <InputPage onNavigateToInitial={navigateToInitial} />
      )}
    </>
  );
}

export default App;
