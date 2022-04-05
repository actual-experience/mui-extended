import { Button, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import { useHideMenu } from "../../src";
import { demoPage } from "../../src/demo-utils/demoLayout";
import { getStaticPropsFactory } from "../../src/demo-utils/staticProps";

const HideMenuDemoComponent: FunctionComponent = () => {
  const hideMenu = useHideMenu();
  return (
    <>
      <Typography variant="subtitle2">
        <strong>Status : </strong> {hideMenu.hide ? "hidden" : "visible"}
      </Typography>
      <Button onClick={hideMenu.toggle}>Toggle Menu</Button>
    </>
  );
};

const HideMenuDemo = demoPage(<HideMenuDemoComponent />, "layout/hide-menu");

export default HideMenuDemo;

export const getStaticProps = getStaticPropsFactory(["layout/hide-menu"]);
