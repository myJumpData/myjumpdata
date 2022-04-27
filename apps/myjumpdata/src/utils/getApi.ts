export default function getApi() {
  return process.env["NODE_ENV"] === "development"
    ? "http://localhost:3333"
    : "https://api.myjumpdata.fediv.me";
}
