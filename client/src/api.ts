const CURRENT_CLIENT_VERSION = 3;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isJson(str: any) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

async function getRequest<Res>(url: string) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'x-client-version': String(CURRENT_CLIENT_VERSION) },
    }).then((r) => r.json());

    return res as Res;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function postRequest<Req, Res>(url: string, body: Req) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-client-version': String(CURRENT_CLIENT_VERSION) },
      body: JSON.stringify(body),
    }).then(async (r) => {
      if (!r.ok) {
        throw new Error(await r.text());
      }
      return r.json();
    });

    return res as Res;
  } catch (err) {
    if (err.message && isJson(err.message)) {
      const errorObject = JSON.parse(err.message);
      console.log(errorObject);
    } else {
      console.error(err);
    }
    throw err;
  }
}

async function deleteRequest<Req, Res>(url: string, body?: Req) {
  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-client-version': String(CURRENT_CLIENT_VERSION) },
      body: JSON.stringify(body),
    }).then((r) => r.json());

    return res as Res;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function attemptLogin(userName: string, password: string) {
  const body = { userName, password };
  return postRequest<PostLoginRequestBody, PostLoginResponseBody>('/api/users/authenticate', body);
}

export async function logout() {
  return getRequest<any>('/api/users/logout');
}

export async function checkLoggedIn() {
  return {
    user: {
      userName: 'foo',
      displayName: 'foo',
      isAdmin: true,
      id: '1',
    },
    loggedIn: true,
  };
  // return getRequest<any>('/api/users/authenticated');
}

export async function createUser(userObj: PostSignupRequestBody) {
  const body = userObj;
  return postRequest<PostSignupRequestBody, PostSignupResponseBody>('/api/users/signup', body);
}
