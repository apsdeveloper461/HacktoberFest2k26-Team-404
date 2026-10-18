// The demo's state machine: sketch → reading → structuring → interactive.
// "Compile" plays the stages automatically; the stepper jumps anywhere and
// stops the autoplay. Timers are owned by one effect and always cleaned up,
// so repeated clicks can't stack transitions.
import { useEffect, useReducer } from "react";

export const STAGES = ["sketch", "reading", "structuring", "interactive"] as const;
export type Stage = (typeof STAGES)[number];

type State = { stage: Stage; auto: boolean; run: number };

type Action =
  | { type: "compile" }
  | { type: "advance" }
  | { type: "goto"; stage: Stage }
  | { type: "reset" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "compile":
      return { stage: "reading", auto: true, run: state.run + 1 };
    case "advance": {
      if (!state.auto) return state;
      const next = STAGES[STAGES.indexOf(state.stage) + 1] ?? "interactive";
      return { ...state, stage: next, auto: next !== "interactive" };
    }
    case "goto":
      return { stage: action.stage, auto: false, run: state.run + 1 };
    case "reset":
      return { stage: "sketch", auto: false, run: state.run + 1 };
  }
}

export function useDemoMachine(dwell: { reading: number; structuring: number }) {
  const [state, dispatch] = useReducer(reducer, { stage: "sketch", auto: false, run: 0 });

  useEffect(() => {
    if (!state.auto) return;
    if (state.stage !== "reading" && state.stage !== "structuring") return;
    const timer = window.setTimeout(() => dispatch({ type: "advance" }), dwell[state.stage]);
    return () => window.clearTimeout(timer);
  }, [state.auto, state.stage, state.run, dwell]);

  return { ...state, running: state.auto, dispatch };
}
