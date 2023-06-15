export const createUser = async (logName, email, password) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_URL_SERVER}/create-user`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          logName,
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

export const updateUser = async (userData) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_URL_SERVER}/user`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    return null;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_URL_SERVER}/user/${id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    return data;
  } catch (error) {
    return null;
  }
};
