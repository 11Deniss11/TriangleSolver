import { ReactNode } from "react";

// Props to pass in
interface Props {
  title: string;
  width?: string;
  topPosition?: string;
  leftPosition?: string;
  bottomPosition?: string;
  rightPosition?: string;
  padding?: string;
  children?: ReactNode;
}

// InfoBox component
const InfoBox = ({
  title,
  children,
  width = "20%",
  topPosition = "auto",
  leftPosition = "auto",
  bottomPosition = "auto",
  rightPosition = "auto",
  padding = "20px",
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
        left: leftPosition,
        bottom: bottomPosition,
        right: rightPosition,
      }}
    >
      <div
        style={{
          padding: padding,
          paddingBottom: padding,
          backgroundColor: "#8db3b1",
          borderRadius: "10px",
        }}
      >
        <div style={{ textAlign: "center", padding: "1px" }}>
          <h3>{title}</h3>
        </div>
        {children && <>{children}</>}
      </div>
    </div>
  );
};

// Export InfoBox component
export default InfoBox;
