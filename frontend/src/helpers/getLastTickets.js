export const getLastTickets = async () => {
  try {
    const resp = await fetch(
      `${process.env.REACT_APP_URL_SERVER}/last-tickets`
    );
    const data = await resp.json();

    return data.lastTickets;
  } catch (error) {
    return null;
  }
};
