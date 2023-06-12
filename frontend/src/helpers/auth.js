export const login = async (email, password) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_URL_SERVER}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
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
    const response = await fetch(`${process.env.REACT_APP_URL_SERVER}/users-list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    return null;
  }
}
