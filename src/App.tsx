import InfoBox from "./components/InfoBox";
import Title from "./components/Title";
import Screen from "./components/Screen";
import MovingBackground from "./components/MovingBackground";
import { useState } from "react";
import { useEffect } from "react";

// create app component
function App() {
  // initialize show ambigious and show error booleans
  const [showAbiguousInfo, setShowAmbiguousInfo] = useState(false);
  const [showError, setShowError] = useState(false);
  // initialize error message
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // remove scroll bars
    document.body.style.overflow = "hidden";

    return () => {
      // add scroll bars back when leaving
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      {/* place moving background */}
      <MovingBackground />
      {/* place title component */}
      <Title
        width="400px"
        padding="1px"
        centerPosition="50%"
        topPosition="0.5%"
      >
        <h2>Triangle Calculator</h2>
      </Title>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "2%",
          overflow: "hidden",
          zIndex: 5,
        }}
      >
        <div
          style={{
            padding: "20px",
            paddingBottom: "30px",
            backgroundColor: "#243333",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          {/* Create screen and pass functions to change variables */}
          <Screen
            setAmbiguousInfo={setShowAmbiguousInfo}
            setShowError={setShowError}
            setErrorMessage={setErrorMessage}
          />
        </div>
      </div>
      {/* Set up info box components */}
      <InfoBox
        title="Instructions:"
        topPosition="5%"
        leftPosition="3%"
        width="310px"
        padding="10px"
      >
        <h5>
          Enter exactly three values, including at least one side length.
          <br />
          <br />
          Click "Calculate" to calculate and display the triangle.
          <br />
          <br />
          Click "Clear" to clear the input fields and reset the triangle.
        </h5>
      </InfoBox>
      <InfoBox
        title="About:"
        bottomPosition="5%"
        leftPosition="3%"
        width="310px"
        padding="10px"
      >
        <h6>
          Created by: Denis Cuznetov
          <br />
          Made with: React and TypeScript
        </h6>
      </InfoBox>

      {/* If showAmbigiousInfo is true, show the info boxes with amigious info */}
      {showAbiguousInfo && (
        <InfoBox
          title="Ambiguous Triangle"
          bottomPosition="5%"
          rightPosition="3%"
          width="310px"
          padding="10px"
        >
          <h5>
            The values you entered can form multiple triangles.
            <br />
            <br />
            Click "Toggle Case" to see other possible triangle.
          </h5>
        </InfoBox>
      )}
      {/* If showError is true, show the error string in errorMessage */}
      {showError && (
        <InfoBox
          title="Error"
          topPosition="60%"
          leftPosition="75%"
          width="20%"
          padding="10px"
        >
          <h5>{errorMessage}</h5>
        </InfoBox>
      )}
    </div>
  );
}

// export app component
export default App;
