export const createUser = async ({ logName, email, password, images }) => {
  try {
    let imgProfile;

    if (images?.length > 0) {
      const formData = new FormData();

      formData.append("file", images[0].originFileObj);

      const imageUpload = await fetch(
        `${process.env.REACT_APP_URL_SERVER}/upload`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await imageUpload.json();

      imgProfile = data.imgUrl;
    }

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
          imgProfile,
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
    let imgProfile;

    if (userData.images?.length > 0) {
      const formData = new FormData();

      formData.append("file", userData.images[0].originFileObj);

      const imageUpload = await fetch(
        `${process.env.REACT_APP_URL_SERVER}/upload`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await imageUpload.json();

      imgProfile = data.imgUrl;
    }

    const response = await fetch(`${process.env.REACT_APP_URL_SERVER}/user`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...userData, imgProfile }),
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
