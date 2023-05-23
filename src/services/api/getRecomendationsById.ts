
export const getRecomendationsById =  async (id: number) => {
  const url = 'http://localhost:4000/api/recomendations?voluntarioId=' + id;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if(data.success) {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error(error)
    return error
  }
}