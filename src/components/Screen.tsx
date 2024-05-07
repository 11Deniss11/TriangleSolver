import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Triangle, Coordinate } from "../TriangleClass";
import SmallButton from "./SmallButton";

// passed in from app.tsx
interface Props {
  sizeRatio?: number; // for setting ratio of the triangle solver size to screen size
  backgroundColor?: string; // Of the canvas drawing
  lineColor?: string; // default line color
  setAmbiguousInfo?: (ambiguous: boolean) => void; // to show the ambiguous info box
  setShowError?: (showError: boolean) => void; // show error info box
  setErrorMessage?: (errorMessage: string) => void; // set error message for info box
}

// screen component responsible for the triangle display and buttons
const Screen = ({
  // initialize defaults
  sizeRatio = 2.5 / 3,
  backgroundColor = "#ffffff",
  lineColor = "#000000",
  setAmbiguousInfo = () => {},
  setShowError = () => {},
  setErrorMessage = () => {},
}: Props) => {
  // create reference to be passed into canvas element
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // create default triangle
  const newTriangle = new Triangle(1, 1, 1, 0, 0, 0);
  // initialize triangle object
  const [triangle, setTriangle] = useState<Triangle>(newTriangle);

  // initialize coordinates of triangle points
  const [coordinates, setCoordinates] = useState<Coordinate[]>([
    { x: 0, y: 0.5 },
    { x: 0.5, y: -0.5 },
    { x: -0.5, y: -0.5 },
  ]);

  // initialize shifted coordinates used for centering the triangle
  const [shiftedCoordinates, setShiftedCoordinates] = useState<Coordinate[]>([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]);

  // initialize the size value for use in scaling the triangle
  const [size, setSize] = useState<number>(
    sizeRatio * Math.min(window.innerWidth, window.innerHeight)
  );

  // initialize the hide input boxes boolean
  const [hideInput, setHideInput] = useState(false);
  // initialize show hide input button boolean
  const [showHideInputButton, setShowHideInputButton] = useState(false);

  // initialize active render button boolean
  const [activeRenderButton, setActiveRenderButton] = useState(true);

  // initialize active reset button boolean
  const [activeResetButton, setActiveResetButton] = useState(false);

  // function to handle resizing of the window
  const handleResize = () => {
    setSize(Math.min(window.innerWidth, window.innerHeight) * sizeRatio);
  };

  // useEffect to be run on start and change in dependencies
  useEffect(() => {
    // set coordinates to calculated coordinates from triangle object
    setCoordinates(triangle.coords);
    // check for valid triangle and valid triangle inputs
    const triangleIsFullyValid = triangle.isValid && triangle.isValidInput;
    // show error with error message if triangle or input values aren't valid
    setShowError(!triangleIsFullyValid);
    setErrorMessage(triangle.errorMessage);
    // run drawToScreen function to draw triangle to canvas and recieve shifted coordinates of the triangle points
    const shiftedCoordinates = drawToScreen(
      canvasRef,
      size,
      backgroundColor,
      lineColor,
      coordinates,
      triangleIsFullyValid
    );

    // shift coordinates down
    for (let i = 0; i < shiftedCoordinates.length; i++) {
      shiftedCoordinates[i].y -= size;
    }

    //update shifted coordinates for input boxes
    setShiftedCoordinates(shiftedCoordinates);

    // add event listener for resizing the window and run handle resize function
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [triangle, coordinates, size, backgroundColor, lineColor]); // dependencies

  //initialize input values
  const [inputValues, setInputValues] = useState({
    a: "",
    b: "",
    c: "",
    A: "",
    B: "",
    C: "",
  });
  // function to handle change in input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // set new values to be the same as old except for the changed value
    const newValues = {
      ...inputValues,
      [e.target.name]: e.target.value,
    };

    for (const key in newValues) {
      // If value typed in not a valid number, reset value to previous saved state
      if (isNaN(Number(newValues[key as keyof typeof newValues]))) {
        newValues[key as keyof typeof newValues] =
          inputValues[key as keyof typeof inputValues];
      }
    }
    // update input values
    setInputValues(newValues);
  };

  // function to handle triangle render
  const handleRender = () => {
    const newValues = { ...inputValues };

    for (const key in newValues) {
      // if value given is 0, set it to Nan before number conversion
      if (newValues[key as keyof typeof newValues] === "0") {
        newValues[key as keyof typeof newValues] = "a";
      }
    }

    // create newTriangle object based on input values
    const newTriangle = new Triangle(
      Number(newValues.a),
      Number(newValues.b),
      Number(newValues.c),
      // convert degrees to radians
      (Number(newValues.A) * Math.PI) / 180,
      (Number(newValues.B) * Math.PI) / 180,
      (Number(newValues.C) * Math.PI) / 180
    );
    // set triangle to the newTriangle object
    setTriangle(newTriangle);

    // if triangle is valid
    if (newTriangle.isValid && newTriangle.isValidInput) {
      // show option to hide input boxes
      setShowHideInputButton(true);
      // set input values to the solved newTriangle object values, rounded to 2 decimal places
      setInputValues({
        a: newTriangle.a.toFixed(2),
        b: newTriangle.b.toFixed(2),
        c: newTriangle.c.toFixed(2),
        // convert to degrees
        A: ((newTriangle.A * 180) / Math.PI).toFixed(2),
        B: ((newTriangle.B * 180) / Math.PI).toFixed(2), // °
        C: ((newTriangle.C * 180) / Math.PI).toFixed(2),
      });
      // Make render button inactive until reset
      setActiveRenderButton(false);
    }

    // Make reset button active
    setActiveResetButton(true);

    // show ambigious info box if the newTriangle object is ambigiuous
    setAmbiguousInfo(newTriangle.ambiguous);
  };

  // function to handle reset of the triangle
  const handleReset = () => {
    // reset triangle object to be the default triangle
    const newTriangle = new Triangle(1, 1, 1, 0, 0, 0);
    setTriangle(newTriangle);
    // clear input values
    setInputValues({ a: "", b: "", c: "", A: "", B: "", C: "" });
    // hide ambigious info box
    setAmbiguousInfo(false);
    // hide the hide input boxes button
    setShowHideInputButton(false);
    // show input boxes
    setHideInput(false);
    // make render button active
    setActiveRenderButton(true);
    // make reset button inactive
    setActiveResetButton(false);
  };

  // function to handle the cycling between multiple solutions
  const handleCycle = () => {
    // ensure triangle is ambiguous
    if (triangle.ambiguous) {
      // copy triangle data
      const newTriangle = triangle;
      // flip the primary and secondary triangle values
      newTriangle.triangleFlip();
      // update triangle object
      setTriangle(newTriangle);
      // update coordinates to draw
      setCoordinates(newTriangle.coords);

      // if newTriangle is valid (which it should be)
      if (newTriangle.isValid && newTriangle.isValidInput) {
        // update input values to the newTriangle values, rounded to 2 decimal places
        setInputValues({
          a: newTriangle.a.toFixed(2),
          b: newTriangle.b.toFixed(2),
          c: newTriangle.c.toFixed(2),
          // convert to degrees
          A: ((newTriangle.A * 180) / Math.PI).toFixed(2),
          B: ((newTriangle.B * 180) / Math.PI).toFixed(2),
          C: ((newTriangle.C * 180) / Math.PI).toFixed(2),
        });
      }
    }
  };

  return (
    <>
      {/* create parent react fragment */}

      {/* create canvas with the canvas reference and specified size and height */}
      <canvas ref={canvasRef} width={size} height={size} className="rounded" />
      {/* create div for buttons */}
      <div
        style={{
          position: "relative",
          zIndex: 5,
        }}
      >
        {/* creating buttons using the SmallButton component */}
        {/* Render Triangle Button */}
        <SmallButton
          topPosition={"-10px"}
          leftPosition={`${size / 2 - 150}px`}
          padding="1px"
          width="150px"
          onClick={handleRender}
          active={activeRenderButton}
        >
          Calculate Triangle
        </SmallButton>
        {/* Reset Button */}
        <SmallButton
          topPosition={"-10px"}
          leftPosition={`${size / 2}px`}
          padding="1px"
          width="150px"
          onClick={handleReset}
          active={activeResetButton}
        >
          Clear Triangle
        </SmallButton>
        {/* Cycle Ambigious solution button, with additional logic for small window sizes */}
        <SmallButton
          topPosition={size > 520 ? "-10px" : "-40px"}
          leftPosition={size > 520 ? `${size / 2 + 150}px` : `${size / 2}px`}
          hidden={!triangle.ambiguous}
          padding="1px"
          width="133px"
          onClick={handleCycle}
        >
          Toggle Case
        </SmallButton>
        {/* Show/Hide input boxes button, with additional logic for small window sizes */}
        <SmallButton
          topPosition={size > 520 ? "-10px" : "-40px"}
          leftPosition={
            size > 520 ? `${size / 2 - 290}px` : `${size / 2 - 140}px`
          }
          hidden={!showHideInputButton}
          padding="1px"
          width="140px"
          onClick={() => {
            setHideInput(!hideInput);
          }}
        >
          {hideInput ? "Show Input Boxes" : "Hide Input Boxes"}
        </SmallButton>
        {/* if input is not hidden, show input boxes */}
        {!hideInput && (
          <>
            {/* wrap in react fragment */}

            {/* input boxes for size lengths, moved to the shifted coordinates of the triangle or between between them */}
            <input
              name="a"
              value={inputValues.a}
              onChange={handleInputChange}
              style={{
                position: "absolute",
                left: `${
                  (shiftedCoordinates[0].x + shiftedCoordinates[2].x) / 2 - 25
                }px`,
                top: `${
                  (shiftedCoordinates[0].y + shiftedCoordinates[2].y) / 2 - 15
                }px`,
                width: `${
                  inputValues.a.length > 5
                    ? (String(inputValues.a).length - 5) * 9 + 50
                    : 50
                }px`,
              }}
            />
            <input
              name="b"
              value={inputValues.b}
              onChange={handleInputChange}
              style={{
                position: "absolute",
                left: `${
                  (shiftedCoordinates[0].x + shiftedCoordinates[1].x) / 2 - 25
                }px`,
                top: `${
                  (shiftedCoordinates[0].y + shiftedCoordinates[1].y) / 2 - 15
                }px`,
                width: `${
                  inputValues.b.length > 5
                    ? (String(inputValues.b).length - 5) * 9 + 50
                    : 50
                }px`,
              }}
            />
            <input
              name="c"
              value={inputValues.c}
              onChange={handleInputChange}
              style={{
                position: "absolute",
                left: `${
                  (shiftedCoordinates[1].x + shiftedCoordinates[2].x) / 2 - 25
                }px`,
                top: `${
                  (shiftedCoordinates[1].y + shiftedCoordinates[2].y) / 2 - 15
                }px`,
                width: `${
                  inputValues.c.length > 5
                    ? (String(inputValues.c).length - 5) * 9 + 50
                    : 50
                }px`,
              }}
            />
            <input
              name="A"
              value={inputValues.A}
              onChange={handleInputChange}
              style={{
                position: "absolute",
                left: `${shiftedCoordinates[1].x - 25}px`,
                top: `${shiftedCoordinates[1].y - 34}px`,
                width: `${
                  inputValues.A.length > 5
                    ? (String(inputValues.A).length - 5) * 9 + 50
                    : 50
                }px`,
              }}
            />
            <input
              name="B"
              value={inputValues.B}
              onChange={handleInputChange}
              style={{
                position: "absolute",
                left: `${shiftedCoordinates[2].x}px`,
                top: `${shiftedCoordinates[2].y - 5}px`,
                width: `${
                  inputValues.B.length > 5
                    ? (String(inputValues.B).length - 5) * 9 + 50
                    : 50
                }px`,
              }}
            />
            <input
              name="C"
              value={inputValues.C}
              onChange={handleInputChange}
              style={{
                position: "absolute",
                right: `${size - shiftedCoordinates[0].x}px`,
                top: `${shiftedCoordinates[0].y - 5}px`,
                width: `${
                  inputValues.C.length > 5
                    ? (String(inputValues.C).length - 5) * 9 + 50
                    : 50
                }px`,
              }}
            />
          </>
        )}
      </div>
    </>
  );
};

// function to draw to the canvas
function drawToScreen(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  size: number,
  backgroundColor: string,
  lineColor: string,
  coordinates: Coordinate[],
  isValid: boolean
) {
  // initialize canvas object and canvas context object assuming website is fully rendered on client side
  const canvas = canvasRef.current!;
  const ctx = canvas.getContext("2d")!;

  // fill background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, size, size);

  // set line width and colour
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;

  // if triangle is not valid, make lines red
  if (!isValid) {
    ctx.strokeStyle = "#ad0000";
  }

  // initialize coordinate for the center of the triangle
  let center: Coordinate = {
    x: (coordinates[0].x + coordinates[1].x + coordinates[2].x) / 3,
    y: (coordinates[0].y + coordinates[1].y + coordinates[2].y) / 3,
  };

  // shift coordinates to the center of the canvas
  const centeredCoordinates = coordinates.map((coordinate) => ({
    x: coordinate.x - center.x,
    y: coordinate.y - center.y,
  }));

  // set scale factor based on the farthest triangle point
  let scaleFactor = Math.max(
    Math.max(
      Math.max(
        Math.abs(centeredCoordinates[0].x),
        Math.abs(centeredCoordinates[0].y)
      ),
      Math.max(
        Math.abs(centeredCoordinates[1].x),
        Math.abs(centeredCoordinates[1].y)
      )
    ),
    Math.max(
      Math.abs(centeredCoordinates[2].x),
      Math.abs(centeredCoordinates[2].y)
    )
  );

  // initialize padding from the edge of the canvas
  const edgeOffset = 45;

  // set the new size based on the offset
  let shiftedSize = size - edgeOffset * 2;

  // calculate shifted coordinates by normalizing coordinates, center to the screen, scaled to fit the shifted size, and adding the edge offset
  const shiftedCoordinates = centeredCoordinates.map((coordinate) => ({
    x:
      shiftedSize / 2 +
      ((coordinate.x / scaleFactor) * shiftedSize) / 2 +
      edgeOffset,
    y:
      shiftedSize / 2 -
      ((coordinate.y / scaleFactor) * shiftedSize) / 2 +
      edgeOffset,
  }));

  ctx.beginPath();
  // move to starting coordinate
  ctx.moveTo(shiftedCoordinates[0].x, shiftedCoordinates[0].y);
  for (let i = 1; i < shiftedCoordinates.length; i++) {
    // draw line to next coordinate
    ctx.lineTo(shiftedCoordinates[i].x, shiftedCoordinates[i].y);
  }
  // close path and apply line stroke
  ctx.closePath();
  ctx.stroke();
  // return shifted coordinates for input boxes
  return shiftedCoordinates;
}

// export the screen component
export default Screen;
