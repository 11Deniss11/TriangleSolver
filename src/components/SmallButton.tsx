import { ReactNode } from "react";
import { useState } from "react";

// to be passed in
interface Props {
  children: ReactNode;
  topPosition: string;
  leftPosition: string;
  padding: string;
  width: string;
  height?: string;
  hidden?: boolean;
  active?: boolean;
  onClick: () => void;
}

// set colours for button
const regularBackgroundColour = "#8db3b1";
const hoverBackgroundColour = "#b3d1cf";
const inactiveBackgroundColour = "#6b8786";

// create smallButton component
function SmallButton({
  children,
  onClick,
  topPosition,
  leftPosition,
  padding,
  width,
  height,
  hidden = false,
  active = true,
}: Props) {
  // initialize isHovered boolean
  const [isHovered, setIsHovered] = useState(false);

  // initialize colour of button
  const [backgroundColour, setBackgroundColour] = useState<string>(
    regularBackgroundColour
  );

  // if button is hidden, return nothing, otherwise return button
  if (hidden) {
    return null;
  }

  // set background colour dependent on whether the button is active and hovered on
  if (active && isHovered && backgroundColour !== hoverBackgroundColour) {
    setBackgroundColour(hoverBackgroundColour);
  } else if (!active && backgroundColour !== inactiveBackgroundColour) {
    setBackgroundColour(inactiveBackgroundColour);
  } else if (
    active &&
    !isHovered &&
    backgroundColour !== regularBackgroundColour
  ) {
    setBackgroundColour(regularBackgroundColour);
  }

  return (
    <div
      style={{
        padding: "3px",
        backgroundColor: "#243333",
        borderRadius: "10px",
        width: width,
        height: height,
        position: "absolute",
        top: topPosition,
        left: leftPosition,
        zIndex: 6,
      }}
    >
      {/* set background colour dependent on whether the mouse is hovering on it */}
      {/* detect if mouse is hovering over the button div */}
      <div
        style={{
          padding: padding,
          paddingBottom: padding,
          backgroundColor: backgroundColour,
          borderRadius: "10px",
          textAlign: "center",
          zIndex: 5,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={{ userSelect: "none" }}>{children}</div>
        <button
          onClick={active ? onClick : () => {}} // if button is not active, do nothing
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0,
          }}
        />
      </div>
    </div>
  );
}

export default SmallButton;
