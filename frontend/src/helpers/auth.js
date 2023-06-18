export const login = async (email, password) => {
  try {
    const response = await fetch(
      `${
        process.env.NODE_ENV !== "production"
          ? process.env.REACT_APP_URL_SERVER
          : window.origin.replace(":3000", ":4000")
      }/login`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password,
        }),
      }
    );

    const data = await response.json();

    return data;
  } catch (error) {
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await fetch(
      `${
        process.env.NODE_ENV !== "production"
          ? process.env.REACT_APP_URL_SERVER
          : window.origin.replace(":3000", ":4000")
      }/users-list`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const data = await response.json();

    return data;
  } catch (error) {
    return null;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await fetch(
      `${
        process.env.NODE_ENV !== "production"
          ? process.env.REACT_APP_URL_SERVER
          : window.origin.replace(":3000", ":4000")
      }/profile`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const data = await response.json();

    return {
      ...data,
      imgProfile: data.imgProfile
        ? `${
            process.env.NODE_ENV !== "production"
              ? process.env.REACT_APP_URL_SERVER
              : window.origin.replace(":3000", ":4000")
          }${data.imgProfile}`
        : undefined,
    };
  } catch (error) {
    return null;
  }
};

export const logout = async () => {
  try {
    const response = await fetch(
      `${
        process.env.NODE_ENV !== "production"
          ? process.env.REACT_APP_URL_SERVER
          : window.origin.replace(":3000", ":4000")
      }/logout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    return response.json();
  } catch (error) {
    return null;
  }
};
