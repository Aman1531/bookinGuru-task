const POLLUTION_URI="https://be-recruitment-task.onrender.com"

const fetchToken = async (token=null) => {
  let api , body;
  if(!token) {
    api = "/auth/login";
    body =JSON.stringify({
              "username": "testuser",
              "password": "testpass"
              });
  }
  else {
    api = "/auth/refresh";
    body = JSON.stringify({"refreshToken": token.refreshToken })
  }

  try {
  const response = await fetch(POLLUTION_URI+api, {
  method: 'POST',
  body: body,
   headers: {
      'content-type': 'application/json',
    }
  })
    if(!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json();
  }
  catch(error) {
    console.error('Error fetching data:' ,error);
  }

 }

module.exports = {fetchToken}
