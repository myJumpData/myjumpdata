export default function initials(user: any) {
  if (!user) {
    return;
  }
  if (
    user.firstname &&
    user.firstname !== "" &&
    user.lastname &&
    user.lastname !== ""
  ) {
    return (user.firstname.charAt(0) + user.lastname.charAt(0)).toUpperCase();
  }
  if (user.username && user.username !== "") {
    return (user.username.charAt(0) + user.username.charAt(-1)).toUpperCase();
  }
  throw new Error("No initials found");
}
