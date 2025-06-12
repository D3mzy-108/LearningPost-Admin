interface HttpResponse {
  success: boolean;
  message: string;
  data: any;
}

async function postFunction(
  url: string,
  requestBody: object
): Promise<HttpResponse> {
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
      } as HttpResponse;
    }
    const data = await response.json();
    return {
      success: data.success,
      message: data.message,
      data: data,
    } as HttpResponse;
  } catch (error) {
    return {
      success: false,
      message: error,
    } as HttpResponse;
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
      } as HttpResponse;
    }
    const data = await response.json();
    return {
      success: data.success,
      message: data.message,
      data: data,
    } as HttpResponse;
  } catch (error) {
    return {
      success: false,
      message: error,
    } as HttpResponse;
  }
}

const http = {
  post: postFunction,
  get: getFunction,
};

export default http;
