import { capitalize } from "./capitalize";

export default function fullname(user: any) {
  if (!user) {
    return;
  }
  if (
    user.firstname &&
    user.firstname !== "" &&
    user.lastname &&
    user.lastname !== ""
  ) {
    return capitalize(user.firstname + " " + user.lastname);
  }
  if (user.username && user.username !== "") {
    return capitalize(user.username);
  }
  return "";
}
