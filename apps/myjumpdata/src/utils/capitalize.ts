export function capitalize(str) {
  if (!str) {
    return "";
  }
  return str
    .split(" ")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
}
