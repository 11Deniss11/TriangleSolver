import { useState, useRef, useEffect } from "react";
import { Coordinate } from "../TriangleClass";
import { Delaunay } from "d3-delaunay";

// create SimpleTriangle type
type SimpleTriangle = {
  a: Coordinate;
  b: Coordinate;
  c: Coordinate;
};

// initialize points, point velocities, and triangles to be drawn
const points: Coordinate[] = [];
const pointsVelocity: Coordinate[] = [];
const triangles: SimpleTriangle[] = [];

// initialize mouse position
let mouseCoordinates: Coordinate = { x: -100, y: -100 };

// initialize gradient start and end colours
const gradientStartColour = "#374f4f";
const gradientEndColour = "#88bdb0";

// function to draw triangles to the canvas
const drawToBackground = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  width: number,
  height: number,
  trianglesToDraw: SimpleTriangle[]
) => {
  // create canvas and canvas context objects if website has fully loaded on client side
  const canvas = canvasRef.current!;
  const ctx = canvas.getContext("2d")!;
  // set background
  ctx.fillStyle = "#243333";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#000000";

  // for each triangle
  for (let i = 0; i < trianglesToDraw.length; i++) {
    // calculate normalized y coordinate
    const averageYNormalized =
      (trianglesToDraw[i].a.y +
        trianglesToDraw[i].b.y +
        trianglesToDraw[i].c.y) /
      3 /
      height;
    // get colour from gradient based on normalized y coordinate and set for triangle
    ctx.fillStyle = interpolateColor(
      gradientStartColour,
      gradientEndColour,
      1 - averageYNormalized
    );

    // follow path of triangle
    ctx.beginPath();
    ctx.moveTo(trianglesToDraw[i].a.x, trianglesToDraw[i].a.y);
    ctx.lineTo(trianglesToDraw[i].b.x, trianglesToDraw[i].b.y);
    ctx.lineTo(trianglesToDraw[i].c.x, trianglesToDraw[i].c.y);
    ctx.lineTo(trianglesToDraw[i].a.x, trianglesToDraw[i].a.y);
    ctx.closePath();
    // fill triangle
    ctx.fill();
  }
};

// movingBackground component responsible for the background to the website
const MovingBackground = () => {
  // create canvas reference to pass to the canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // initialize width and height
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  // initialize mouse position
  // const [mouseCoordinates, setMouseCoordinates] = useState<Coordinate>({
  //   x: 0,
  //   y: 0,
  // });

  // generate 150 random points on initial render
  useEffect(() => {
    generateRandomPoints(150, window.innerWidth, window.innerHeight);
    // begin animation loop
    animate();
  }, []);

  useEffect(() => {
    // add event listeners for window resize and mouse movement
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    });

    const updateMousePosition = (ev: MouseEvent) => {
      const x: number = ev.clientX;
      const y: number = ev.clientY;
      mouseCoordinates = { x, y };
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  // useEffect(() => {
  //   console.log("mouseEvent", mouseCoordinates);
  // }, [mouseCoordinates]);

  // function run to animate the points
  const animate = () => {
    // update point locations and velocities
    updatePoints();
    // generate triangles
    generateTriangles();
    // draw triangles to the background canvas
    drawToBackground(canvasRef, width, height, triangles);
    // schedule next animation frame
    requestAnimationFrame(animate);
  };

  return (
    <div style={{ position: "absolute", zIndex: -10, overflow: "hidden" }}>
      {/* create canvas and pass in the canvas reference */}
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
};

// function to generate random points
const generateRandomPoints = (
  numberOfPoints: number,
  width: number,
  height: number
) => {
  // initialize intesity of random velocity
  const velocityIntesity = 0.01;
  // set points and point velocity arrays to empty
  points.length = 0;
  pointsVelocity.length = 0;
  for (let i = 0; i < numberOfPoints; i++) {
    // add randomly placed point with random velocity close to the center of the screen
    points.push({
      x: (Math.random() * width) / 2 + width / 4,
      y: (Math.random() * height) / 2 + height / 4,
    });
    pointsVelocity.push({
      x: Math.random() * velocityIntesity * 2 - velocityIntesity,
      y: Math.random() * velocityIntesity * 2 - velocityIntesity,
    });
  }
};

// get squared distance between 2 coordinates
const getSquaredDistance = (p1: Coordinate, p2: Coordinate) => {
  return Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2);
};

// get angle between 2 coordinates
const getAngleBetweenPoints = (a: Coordinate, b: Coordinate) => {
  return Math.atan2(b.y - a.y, b.x - a.x);
};

// function to generate triangles from points
const generateTriangles = () => {
  // reset triangle array to be empty
  triangles.length = 0;

  // mapping points to format accepted by d3 library
  const delaunayPoints = Float64Array.from(
    points.flatMap((point) => [point.x, point.y])
  );

  // create delaunay object from the points
  const delaunay = new Delaunay(delaunayPoints);
  // retrieve triangles from the delaunay object
  const dTriangles = delaunay.triangles;

  // convert delaunay triangles to SimpleTriangle type
  for (let i = 0; i < dTriangles.length; i += 3) {
    const a = points[dTriangles[i]];
    const b = points[dTriangles[i + 1]];
    const c = points[dTriangles[i + 2]];

    const triangle = { a, b, c };

    triangles.push(triangle);
  }
};

// function to get colour from gradient using a value from 0 to 1
const interpolateColor = (color1: string, color2: string, factor: number) => {
  // convert colours from hex strings to numbers
  const c1 = color1
    .slice(1)
    .match(/.{2}/g)!
    .map((v) => parseInt(v, 16));
  const c2 = color2
    .slice(1)
    .match(/.{2}/g)!
    .map((v) => parseInt(v, 16));
  // calculate colour from interpolating between them
  const result = c1.map((v, i) => v + factor * (c2[i] - v)).map(Math.round);
  // convert colour from number to string
  return "#" + result.map((v) => v.toString(16).padStart(2, "0")).join("");
};

// function to update the point positions
const updatePoints = () => {
  // set constants
  const gravity = 0;
  const intensity = 35;
  const mouseIntensity = 40;
  const bounceCoefficient = 0.3;
  const wallFriction = 0.95;
  const dragCoefficient = 0.9999;
  const distanceThreshold = 10000;

  // loop through all the points
  for (let i = 0; i < points.length; i++) {
    // apply repulsive force from mouse
    const distanceToMouse = getSquaredDistance(points[i], {
      x: mouseCoordinates.x,
      y: mouseCoordinates.y,
    });
    if (distanceToMouse < distanceThreshold) {
      const angle = getAngleBetweenPoints(points[i], {
        x: mouseCoordinates.x,
        y: mouseCoordinates.y,
      });
      pointsVelocity[i] = {
        x:
          pointsVelocity[i].x -
          (Math.cos(angle) / (distanceToMouse + 5)) * mouseIntensity,
        y:
          pointsVelocity[i].y -
          (Math.sin(angle) / (distanceToMouse + 5)) * mouseIntensity,
      };
    }

    // apply repulsive force from all other points
    for (let j = 0; j < points.length; j++) {
      // skip if is itself
      if (i === j) {
        continue;
      }

      // calculate squared distance, skip if distance is negligable
      const distance = getSquaredDistance(points[i], points[j]);
      if (distance > distanceThreshold) {
        continue;
      }
      // calculate angle to apply the foce
      const angle = getAngleBetweenPoints(points[i], points[j]);

      // apply velocity based on squared distance
      pointsVelocity[i] = {
        x: pointsVelocity[i].x - (Math.cos(angle) / (distance + 5)) * intensity,
        y: pointsVelocity[i].y - (Math.sin(angle) / (distance + 5)) * intensity,
      };
    }
    // update position based on velocity
    points[i].x += pointsVelocity[i].x;
    points[i].y += pointsVelocity[i].y;

    // apply drag
    pointsVelocity[i].x *= dragCoefficient;
    pointsVelocity[i].y *= dragCoefficient;

    // apply gravity
    pointsVelocity[i].y += gravity;

    // add horizontal border collisions
    if (points[i].x < 0) {
      points[i].x = 0;
      // apply bounce
      pointsVelocity[i].x = -pointsVelocity[i].x * bounceCoefficient;
      // apply wall friction
      pointsVelocity[i].y *= wallFriction;
    } else if (points[i].x > window.innerWidth) {
      points[i].x = window.innerWidth;
      // apply bounce
      pointsVelocity[i].x = -pointsVelocity[i].x * bounceCoefficient;
      // apply wall friction
      pointsVelocity[i].y *= wallFriction;
    }

    // add vertical border collisions
    if (points[i].y < 0) {
      points[i].y = 0;
      // apply bounce
      pointsVelocity[i].y = -pointsVelocity[i].y * bounceCoefficient;
      // apply wall friction
      pointsVelocity[i].x *= wallFriction;
    } else if (points[i].y > window.innerHeight) {
      points[i].y = window.innerHeight;
      // apply bounce
      pointsVelocity[i].y = -pointsVelocity[i].y * bounceCoefficient;
      // apply wall friction
      pointsVelocity[i].x *= wallFriction;
    }
  }
};

// export MovingBackground component
export default MovingBackground;
