type TextAllProps = {
  children: any;
  full?: boolean;
  nowrap?: boolean;
};

function fullClass(full?: boolean) {
  let fullClass = "";
  if (full) {
    fullClass = " w-full ";
  }
  return fullClass;
}

function nowrapClass(nowrap?: boolean) {
  let nowrapClass = "";
  if (nowrap) {
    nowrapClass = " whitespace-nowrap ";
  }
  return nowrapClass;
}

export default function Text({children, full, nowrap}: TextAllProps) {
  return (
    <p
      className={`text-base leading-normal self-center ${fullClass(
        full
      )} ${nowrapClass(nowrap)}`}
    >
      {children}
    </p>
  );
}

export function TextBold({children, full, nowrap}: TextAllProps) {
  return (
    <p
      className={`text-base font-bold leading-normal self-center ${fullClass(
        full
      )} ${nowrapClass(nowrap)}`}
    >
      {children}
    </p>
  );
}

export function H4({children, full, nowrap}: TextAllProps) {
  return (
    <h1
      className={`text-2xl font-bold leading-normal self-center ${fullClass(
        full
      )} ${nowrapClass(nowrap)}`}
    >
      {children}
    </h1>
  );
}

export function H5({children, full, nowrap}: TextAllProps) {
  return (
    <h5
      className={`text-xl font-bold leading-normal self-center ${fullClass(
        full
      )} ${nowrapClass(nowrap)}`}
    >
      {children}
    </h5>
  );
}

