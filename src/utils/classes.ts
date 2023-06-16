export const combineClasses = (...classes: (string | undefined)[]) =>
  classes.map((cls = "") => cls.trim()).join(" ");
