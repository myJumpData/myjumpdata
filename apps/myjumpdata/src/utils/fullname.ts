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
    return user.firstname + " " + user.lastname;
  }
  if (user.username && user.username !== "") {
    return user.username;
  }
  throw new Error("No fullname found");
}
