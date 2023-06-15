export const login = async (email, password) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_URL_SERVER}/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: email,
        password,
      }),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_URL_SERVER}/users-list`,
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
      `${process.env.REACT_APP_URL_SERVER}/profile`,
      {
        method: "GET",
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

export const logout = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_URL_SERVER}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    return response.json();
  } catch (error) {
    return null;
  }
};
