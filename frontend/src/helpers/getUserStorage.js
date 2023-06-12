export const getUserStorage = () => {
  try {
    const localStorageData = {
      agent: localStorage.getItem("agent"),
      desk: localStorage.getItem("desk"),
      email: localStorage.getItem("email"),
    };

    const role = localStorage.getItem("role");

    if (role) {
      localStorageData.role = role;
    }

    return localStorageData;
  } catch (error) {
    return null;
  }
};
