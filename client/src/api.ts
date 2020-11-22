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
  return getRequest<GetAuthenticatedResponseBody>('/api/users/authenticated');
}

export async function createUser(userObj: PostSignupRequestBody) {
  const body = userObj;
  return postRequest<PostSignupRequestBody, PostSignupResponseBody>('/api/users/signup', body);
}

export async function getAllUsers() {
  return getRequest<GetUsersResponseBody>('/api/users');
}

type UserDetails = {
  displayName: string;
  avatarUrl: string;
};

export async function setUserDetails(userId: string, userDetails: UserDetails) {
  const body: UpdateUserDetailsRequestBody = userDetails;
  return postRequest<UpdateUserDetailsRequestBody, UpdateUserDetailsResponseBody>(`/api/users/${userId}/details`, body);
}

export async function getConversations() {
  return getRequest<GetConversationsResponseBody>('/api/conversations');
}

export async function getConversationDetails(conversationId: string) {
  return getRequest<GetConversationDetailsResponseBody>(`/api/conversations/${conversationId}/details`);
}

export async function createConversation(users: Array<IUser>) {
  const body: CreateConversationRequestBody = { users: users.map((user) => user.id) };
  return postRequest<CreateConversationRequestBody, CreateConversationResponseBody>('/api/conversations', body);
}

export async function getMessages(conversationId: string) {
  return getRequest<GetMessagesForConversationResponseBody>(`/api/conversations/${conversationId}/messages`);
}

export async function sendMessage(conversationId: string, content: string) {
  const body: SendMessageToConversationRequestBody = { content };
  return postRequest<SendMessageToConversationRequestBody, SendMessageToConversationResponseBody>(
    `/api/conversations/${conversationId}/sendmessage`,
    body
  );
}
export async function setUserAvatar(userId: string, userAvatar: any) {
  const formData = new FormData();
  formData.append('avatar', userAvatar);
  const res = await fetch(`/api/upload/users/${userId}/avatar`, {
    method: 'POST',
    body: formData,
  });
  console.log(res);
  return res.json();
}
