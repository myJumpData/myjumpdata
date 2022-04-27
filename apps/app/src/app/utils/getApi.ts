export default function getApi() {
  return process.env["NODE_ENV"] === "development"
    ? "http://10.0.2.2:3333"
    : "https://api.myjumpdata.fediv.me";
}
