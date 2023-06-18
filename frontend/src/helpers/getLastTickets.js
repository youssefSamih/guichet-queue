export const getLastTickets = async () => {
  try {
    const resp = await fetch(
      `${
        process.env.NODE_ENV !== "production"
          ? process.env.REACT_APP_URL_SERVER
          : window.origin.replace(":3000", ":4000")
      }/last-tickets`,
      {
        credentials: "include",
      }
    );

    const data = await resp.json();

    return data.lastTickets;
  } catch (error) {
    return null;
  }
};
