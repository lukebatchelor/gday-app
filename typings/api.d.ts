declare type TypedRequest<ReqParam = {}, ReqBody = {}, QueryParams = {}> = {
  params: ReqParam;
  body: ReqBody;
  query: QueryParams;
};
declare type TypedResponse<ResBody = any> = ResBody;

// POST /api/users/signup
declare type PostSignupRequestBody = { userName: string; password: string };
declare type PostSignupRequest = TypedRequest<{}, PostSignupRequestBody, {}>;
declare type PostSignupResponseBody = { loggedIn: boolean; user?: IUser };
declare type PostSignupResponse = TypedResponse<PostSignupResponseBody>;

// POST /api/users/authenticate
declare type PostLoginRequestBody = { userName: string; password: string };
declare type PostLoginRequest = TypedRequest<{}, PostLoginRequestBody, {}>;
declare type PostLoginResponseBody = { loggedIn: boolean; user?: IUser };
declare type PostLoginResponse = TypedResponse<PostLoginResponseBody>;

// POST /api/users/authenticated
declare type GetAuthenticatedRequestBody = {};
declare type GetAuthenticatedRequest = TypedRequest<{}, GetAuthenticatedRequestBody, {}>;
declare type GetAuthenticatedResponseBody = { loggedIn: boolean; user?: IUser };
declare type GetAuthenticatedResponse = TypedResponse<GetAuthenticatedResponseBody>;

// POST /api/conversions
declare type CreateConversationRequestBody = { users: Array<string> };
declare type CreateConversationRequest = TypedRequest<{}, CreateConversationRequestBody, {}>;
declare type CreateConversationResponseBody = { conversation: IConversation };
declare type CreateConversationResponse = TypedResponse<CreateConversationResponseBody>;

// GET /api/conversions
declare type GetConversationsRequestBody = {};
declare type GetConversationsRequest = TypedRequest<{}, GetConversationsRequestBody, {}>;
declare type GetConversationsResponseBody = { conversations: Array<IConversation> };
declare type GetConversationsResponse = TypedResponse<GetConversationsResponseBody>;

// GET /api/conversions/:id/sendmessage
declare type SendMessageToConversationRequestBody = { content: string };
declare type SendMessageToConversationRequestParams = { id: string };
declare type SendMessageToConversationRequest = TypedRequest<{}, SendMessageToConversationRequestBody, {}>;
declare type SendMessageToConversationResponseBody = { conversation: IConversation };
declare type SendMessageToConversationResponse = TypedResponse<SendMessageToConversationResponseBody>;
