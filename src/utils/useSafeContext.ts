import { Context, useContext } from "react";

export function useSafeContext<T>(
  context: Context<T | null>,
  name = context.displayName,
  providerName = `${name || "Context"}.Provider`
) {
  const value = useContext(context);
  if (value == null) {
    throw new Error(`${name} used outside of ${providerName}`);
  }
  return value;
}
