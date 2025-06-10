async function postFunction(url: string, requestBody: object): Promise<object> {
  try {
    // SEND POST REQUEST TO API
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    // GET RESPONSE FROM API
    if (!response.ok) {
      return {
        success: false,
        message: `HTTP Error ${response.status}`,
      };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }
}

async function getFunction(url: string): Promise<object> {
  try {
    const response = await fetch(url);

    // GET RESPONSE FROM API
    if (!response.ok) {
      return {
        success: false,
        message: `HTTP Error ${response.status}`,
      };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }
}

const http = {
  post: postFunction,
  get: getFunction,
};

export default http;
