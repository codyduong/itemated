import React from "@rbxts/react";
import DebugFrame from "./DebugFrame";

interface ScreenProps {}

export default function Screen(props: ScreenProps): JSX.Element {
  return (
    <>
      <DebugFrame />
    </>
  );
}
