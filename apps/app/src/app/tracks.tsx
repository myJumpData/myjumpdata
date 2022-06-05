const TRACKS = [
  {
    id: "1",
    url: "https://www.dtb.de/fileadmin/user_upload/dtb.de/Sportarten/Rope_Skipping/Speed-Tracks/2016-SRSS_-_30s.mp3",
    title: "Single rope speed 30s",
    artist: "DTB",
  },
  {
    id: "2",
    url: "https://www.dtb.de/fileadmin/user_upload/dtb.de/Sportarten/Rope_Skipping/Speed-Tracks/2016-SRE_-_60s_1_min.mp3",
    title: "Single rope speed 60s",
    artist: "DTB",
  },
  {
    id: "3",
    url: "https://www.dtb.de/fileadmin/user_upload/dtb.de/Sportarten/Rope_Skipping/Speed-Tracks/2016-SRE_-_120s_2_min.mp3",
    title: "Single rope speed 120s",
    artist: "DTB",
  },
  {
    id: "4",
    url: "https://www.dtb.de/fileadmin/user_upload/dtb.de/Sportarten/Rope_Skipping/Speed-Tracks/2016-SRE_-_180s_3min.mp3",
    title: "Single rope speed 180s",
    artist: "DTB",
  },
  {
    id: "5",
    url: "https://www.dtb.de/fileadmin/user_upload/dtb.de/Sportarten/Rope_Skipping/Speed-Tracks/2016-SRDU_30s.mp3",
    title: "Single Rope Double Under 30s",
    artist: "DTB",
  },
  {
    id: "6",
    url: "https://www.dtb.de/fileadmin/user_upload/dtb.de/Sportarten/Rope_Skipping/Speed-Tracks/2016-SRSR_-_4x30s.mp3",
    title: "Single Rope Speed Relay 4x30s",
    artist: "DTB",
  },
  {
    id: "7",
    url: "https://www.dtb.de/fileadmin/user_upload/dtb.de/Sportarten/Rope_Skipping/Speed-Tracks/2016-DDSR_-_4x45s.mp3",
    title: "Double Dutch Speed Relay 4x45s",
    artist: "DTB",
  },
  {
    id: "8",
    url: "https://www.dtb.de/fileadmin/user_upload/dtb.de/Sportarten/Rope_Skipping/Speed-Tracks/Freestyle-Zeitansage__Time_Track__75_Sekunden.mp3",
    title: "Freestyle Zeitansage 75s Time Track",
    artist: "DTB",
  },
  {
    id: "9",
    url: "https://www.dtb.de/fileadmin/user_upload/dtb.de/Sportarten/Rope_Skipping/Speed-Tracks/IJRU_Time_Tracks/_1.0.0__SRSS.mp3",
    title: "Single Rope Speed Sprint 30s",
    artist: "IJRU",
  },
  {
    id: "10",
    url: "https://www.dtb.de/fileadmin/user_upload/dtb.de/Sportarten/Rope_Skipping/Speed-Tracks/IJRU_Time_Tracks/_1.0.0__SRTU.mp3",
    title: "Single Rope Triple Unders",
    artist: "IJRU",
  },
  {
    id: "11",
    url: "https://www.dtb.de/fileadmin/user_upload/dtb.de/Sportarten/Rope_Skipping/Speed-Tracks/IJRU_Time_Tracks/_1.0.0__SRDR.mp3",
    title: "Single Rope Double Unders Relay 2x30s",
    artist: "IJRU",
  },
  {
    id: "12",
    url: "https://www.dtb.de/fileadmin/user_upload/dtb.de/Sportarten/Rope_Skipping/Speed-Tracks/IJRU_Time_Tracks/_1.0.0__SRSE.mp3",
    title: "Single Rope Speed Endurance 180s",
    artist: "IJRU",
  },
  {
    id: "13",
    url: "https://www.dtb.de/fileadmin/user_upload/dtb.de/Sportarten/Rope_Skipping/Speed-Tracks/IJRU_Time_Tracks/_1.0.0__SRSR.mp3",
    title: "Single Rope Speed Relay 4x30s",
    artist: "IJRU",
  },
  {
    id: "14",
    url: "https://www.dtb.de/fileadmin/user_upload/dtb.de/Sportarten/Rope_Skipping/Speed-Tracks/IJRU_Time_Tracks/_1.0.0__DDSR.mp3",
    title: "Double Dutch Speed Relay 4x30s",
    artist: "IJRU",
  },
  {
    id: "15",
    url: "https://www.dtb.de/fileadmin/user_upload/dtb.de/Sportarten/Rope_Skipping/Speed-Tracks/IJRU_Time_Tracks/_1.0.0__DDSS.mp3",
    title: "Double Dutch Speed Sprint 60s",
    artist: "IJRU",
  },
];

export const musicData = {
  "616de41ee22a705079dcc6be": { tracks: ["1", "6", "9", "13"] }, // 30s Speed
  "616de41ee22a705079dcc6bf": { tracks: ["5", "11"] }, // 30s DU
  "616de41ee22a705079dcc6c0": { tracks: ["3"] }, // 2m Speed
  "616de41ee22a705079dcc6c1": { tracks: ["4", "12"] }, // 3m Speed
  "61733e79e7141256a47e0d8b": { tracks: ["10"] }, // TU
  "61954f50f3c9237faf68d81d": { tracks: [] }, // 30s Crosses
  "620d44e9a60b7100b71abd07": { tracks: ["2"] }, // 1m Speed
  "629ceefbc0f39493314b458a": { tracks: ["6", "13"] }, // 4x30s Speed
  "629cef10c0f39493314b458c": { tracks: ["11"] }, // 2x30s Double Under
  "629cef2fc0f39493314b458e": { tracks: ["14"] }, // 4x30s Double Dutch Speed
  "629cef44c0f39493314b4590": { tracks: ["15"] }, // 1x1m Double Dutch Speed
};

export default TRACKS;
