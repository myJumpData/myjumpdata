const getLocalAccessToken = () => {
  const storedUser = localStorage.getItem("user");
  let user;
  if (storedUser) {
    user = JSON.parse(storedUser);
  }
  return user?.token;
};

const updateLocalAccessToken = (token: any) => {
  const storedUser = localStorage.getItem("user");
  let user;
  if (storedUser) {
    user = JSON.parse(storedUser);
  }
  user.token = token;
  localStorage.setItem("user", JSON.stringify(user));
};

const getUser = () => {
  const storedUser = localStorage.getItem("user");
  let user;
  if (storedUser) {
    user = JSON.parse(storedUser);
  }
  return user;
};

const setUser = (user: any) => {
  localStorage.setItem("user", JSON.stringify(user));
};

const removeUser = () => {
  localStorage.removeItem("user");
};

const updateUserLocalStorage = ({
  username,
  firstname,
  lastname,
  email,
}: {
  username: any;
  firstname: any;
  lastname: any;
  email: any;
}) => {
  const storedUser = localStorage.getItem("user");
  let user;
  if (storedUser) {
    user = JSON.parse(storedUser);
  }
  if (username && username !== "") {
    user.username = username;
  }
  if (firstname && firstname !== "") {
    user.firstname = firstname;
  }
  if (lastname && lastname !== "") {
    user.lastname = lastname;
  }
  if (email && email !== "") {
    user.email = email;
  }
  localStorage.setItem("user", JSON.stringify(user));
};

const TokenService = {
  getLocalAccessToken,
  updateLocalAccessToken,
  getUser,
  setUser,
  removeUser,
  updateUserLocalStorage,
};

export default TokenService;
