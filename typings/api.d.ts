declare type TypedRequest<ReqParam = {}, ReqBody = {}, QueryParams = {}> = {
  params: ReqParam;
  body: ReqBody;
  query: QueryParams;
};
declare type TypedResponse<ResBody = any> = ResBody;

// GET /api/users
declare type GetUsersRequestBody = {};
declare type GetUsersRequest = TypedRequest<{}, GetUsersRequestBody, {}>;
declare type GetUsersResponseBody = { users?: Array<IUser> };
declare type GetUsersResponse = TypedResponse<GetUsersResponseBody>;

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

// POST /api/user/:id/avatar
declare type UploadAvatarRequestBody = {};
declare type UploadAvatarRequestParams = { id: string };
declare type UploadAvatarRequest = TypedRequest<{}, UploadAvatarRequestBody, {}>;
declare type UploadAvatarResponseBody = { location: string };
declare type UploadAvatarResponse = TypedResponse<UploadAvatarResponseBody>;

// POST /api/conversions
declare type CreateConversationRequestBody = { users: Array<string> };
declare type CreateConversationRequest = TypedRequest<{}, CreateConversationRequestBody, {}>;
declare type CreateConversationResponseBody = { conversation: IConversation };
declare type CreateConversationResponse = TypedResponse<CreateConversationResponseBody>;

// POST /api/conversations/:id
declare type AddUsersToConversationRequestBody = { users: Array<string> };
declare type AddUsersToConversationRequestParams = { id: string };
declare type AddUsersToConversationRequest = TypedRequest<
  AddUsersToConversationRequestParams,
  AddUsersToConversationRequestBody,
  {}
>;
declare type AddUsersToConversationResponseBody = { conversation: IConversation };
declare type AddUsersToConversationResponse = TypedResponse<AddUsersToConversationResponseBody>;

// GET /api/conversions
declare type GetConversationsRequestBody = {};
declare type GetConversationsRequest = TypedRequest<{}, GetConversationsRequestBody, { users: string }>;
declare type GetConversationsResponseBody = { conversations: Array<IConversation> };
declare type GetConversationsResponse = TypedResponse<GetConversationsResponseBody>;

// POST /api/conversions/:id/sendmessage
declare type SendMessageToConversationRequestBody = { content: string };
declare type SendMessageToConversationRequestParams = { id: string };
declare type SendMessageToConversationRequest = TypedRequest<{}, SendMessageToConversationRequestBody, {}>;
declare type SendMessageToConversationResponseBody = { conversation: IConversation };
declare type SendMessageToConversationResponse = TypedResponse<SendMessageToConversationResponseBody>;

// GET /api/conversions/:id/messages
declare type GetMessagesForConversationRequestParams = { id: string };
declare type GetMessagesForConversationRequest = TypedRequest<GetMessagesForConversationRequestParams, {}, {}>;
declare type GetMessagesForConversationResponseBody = { messages: Array<IMessage> };
declare type GetMessagesForConversationResponse = TypedResponse<GetMessagesForConversationResponseBody>;

// POST /api/uploads/:conversationId
declare type UploadFileToConversationRequestBody = {};
declare type UploadFileToConversationRequestParams = { conversationId: string };
declare type UploadFileToConversationRequest = TypedRequest<{}, UploadFileToConversationRequestBody, {}>;
declare type UploadFileToConversationResponseBody = { location: string };
declare type UploadFileToConversationResponse = TypedResponse<UploadFileToConversationResponseBody>;
