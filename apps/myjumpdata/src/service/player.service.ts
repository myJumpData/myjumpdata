import TRACKS from "../tracks";

export const getLibrary = () => {
  return TRACKS;
};

export const getTrack = (id: string) => {
  return TRACKS.find((e) => e.id === id);
};

export const getTracks = (ids: string[]) => {
  return TRACKS.filter((e) => ids.some((id) => id === e.id));
};
