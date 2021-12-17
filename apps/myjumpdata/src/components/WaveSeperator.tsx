import wave_seperator from "../assets/wave_seperator.svg";

export default function WaveSeperator({rotated}: { rotated?: boolean }) {
  return (
    <div
      className={"relative " + (rotated && "transform rotate-180")}
      style={{marginTop: "-1px", marginBottom: "-1px"}}
    >
      <img src={wave_seperator} alt="wave_seperator"/>
    </div>
  );
}
