import Link from "next/link";
import { getComposedLayout } from ".";
import { SodaruPageComponentType } from "../src";

const LayoutWithoutMenuDemo: SodaruPageComponentType = () => {
  return (
    <>
      This is a page using (Layout with out menu)
      <br />
      <Link href="/">Go Back to Home</Link>
      <br />
      <Link href="/sodaru-theme">Go Back to Sodaru Theme</Link>
    </>
  );
};

LayoutWithoutMenuDemo.layout = getComposedLayout(true);

export default LayoutWithoutMenuDemo;
