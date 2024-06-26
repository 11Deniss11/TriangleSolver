import { ReactNode } from "react";

// to be passed in
interface Props {
  children: ReactNode;
  width?: string;
  topPosition?: string;
  centerPosition?: string;
  padding?: string;
}
// title component
const Title = ({
  children,
  width = "20%",
  topPosition = "50%",
  centerPosition = "50%",
  padding = "10px",
}: Props) => {
  return (
    <div
      style={{
        padding: "7px",
        backgroundColor: "#243333",
        borderRadius: "10px",
        width: width,
        position: "absolute",
        top: topPosition,
        left: `calc(${centerPosition} - ${width} / 2)`,
      }}
    >
      <div
        style={{
          padding: padding,
          backgroundColor: "#8db3b1",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
};

// export title component
export default Title;
