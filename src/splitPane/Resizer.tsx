import { Box, SxProps } from "@mui/material";
import { FunctionComponent, MouseEventHandler, TouchEventHandler } from "react";

export type ResizerProps = {
  onClick?: MouseEventHandler;
  onDoubleClick?: MouseEventHandler;
  onMouseDown?: MouseEventHandler;
  onTouchStart?: TouchEventHandler;
  onTouchEnd?: TouchEventHandler;
  size?: number;
  sx?: SxProps;
  split?: "vertical" | "horizontal";
};

export const Resizer: FunctionComponent<ResizerProps> = ({
  size = "horizontal",
  split,
  sx,
  onClick,
  onDoubleClick,
  onMouseDown,
  onTouchStart,
  onTouchEnd
}) => {
  const styles: SxProps =
    split == "vertical"
      ? {
          cursor: "col-resize",
          borderLeft: "3px solid rgba(255, 255, 255, 0)",
          borderRight: "3px solid rgba(255, 255, 255, 0)",
          marginLeft: "-3px",
          marginRight: "-3px",
          width: size
        }
      : {
          cursor: "row-resize",
          borderTop: "3px solid rgba(255, 255, 255, 0)",
          borderBottom: "3px solid rgba(255, 255, 255, 0)",
          marginTop: "-3px",
          marginBottom: "-3px",
          height: size
        };

  return (
    <Box
      role="presentation"
      sx={{
        backgroundColor: "divider",
        backgroundClip: "padding-box",
        zIndex: 1000,
        "&:hover": {
          backgroundColor: "primary.light"
        },
        ...styles,
        ...sx
      }}
      onMouseDown={event => {
        if (onMouseDown) {
          onMouseDown(event);
        }
      }}
      onTouchStart={event => {
        event.preventDefault();
        if (onTouchStart) {
          onTouchStart(event);
        }
      }}
      onTouchEnd={event => {
        event.preventDefault();
        if (onTouchEnd) {
          onTouchEnd(event);
        }
      }}
      onClick={event => {
        event.preventDefault();
        if (onClick) {
          onClick(event);
        }
      }}
      onDoubleClick={event => {
        event.preventDefault();
        if (onDoubleClick) {
          onDoubleClick(event);
        }
      }}
    />
  );
};
