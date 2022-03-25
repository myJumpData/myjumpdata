import TRACKS from "../tracks";

const getLibrary = () => {
  return TRACKS;
};

const getTrack = (id: string) => {
  return TRACKS.find((e) => e.id === id);
};

const getTracks = (ids: string[]) => {
  return TRACKS.filter((e) => ids.some((id) => id === e.id));
};

const PlayerService = {
  getLibrary,
  getTrack,
  getTracks,
};

export default PlayerService;
