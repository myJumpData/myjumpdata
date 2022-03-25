export interface PlayerType {
  repeatMode: "off" | "track" | "queue";
}

const playerReducer = (
  state: PlayerType = { repeatMode: "off" },
  action: any
) => {
  if (action.type === "setRepeatMode") {
    const newState: PlayerType = {
      repeatMode: action.payload,
    };
    return newState;
  }
  return state;
};

export default playerReducer;
