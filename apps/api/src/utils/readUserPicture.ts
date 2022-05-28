import crypto from "crypto";

const readUserPicture = (user) => {
  return user.picture === "gravatar"
    ? `https://secure.gravatar.com/avatar/${crypto
        .createHash("md5")
        .update(user.email)
        .digest("hex")}?size=300&d=404`
    : null;
};

export default readUserPicture;
