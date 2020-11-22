declare type TypedRequest<ReqParam = {}, ReqBody = {}, QueryParams = {}> = {
  params: ReqParam;
  body: ReqBody;
  query: QueryParams;
};
declare type TypedResponse<ResBody = any> = ResBody;

/**
 * User
 */

// GET /api/users
declare type GetUsersRequestBody = {};
declare type GetUsersRequestQueryParams = { users?: string };
declare type GetUsersRequest = TypedRequest<{}, GetUsersRequestBody, GetUsersRequestQueryParams>;
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

// GET /api/users/authenticated
declare type GetAuthenticatedRequestBody = {};
declare type GetAuthenticatedRequest = TypedRequest<{}, GetAuthenticatedRequestBody, {}>;
declare type GetAuthenticatedResponseBody = { loggedIn: boolean; user?: IUser };
declare type GetAuthenticatedResponse = TypedResponse<GetAuthenticatedResponseBody>;

// POST /api/users/:userId/details
declare type UpdateUserDetailsRequestBody = { displayName?: string; avatarUrl?: string };
declare type UpdateUserDetailsRequestParams = { userId: string };
declare type UpdateUserDetailsRequest = TypedRequest<UpdateUserDetailsRequestParams, UpdateUserDetailsRequestBody, {}>;
declare type UpdateUserDetailsResponseBody = { user: IUser };
declare type UpdateUserDetailsResponse = TypedResponse<UpdateUserDetailsResponseBody>;

/**
 * Conversation
 */

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

// POST /api/conversations/:id/details
declare type UpdateConversationDetailsRequestBody = { name?: string; avatarUrl?: string };
declare type UpdateConversationDetailsRequestParams = { id: string };
declare type UpdateConversationDetailsRequest = TypedRequest<
  UpdateConversationDetailsRequestParams,
  UpdateConversationDetailsRequestBody,
  {}
>;
declare type UpdateConversationDetailsResponseBody = { conversation: IConversation };
declare type UpdateConversationDetailsResponse = TypedResponse<UpdateConversationDetailsResponseBody>;

// GET /api/conversations
declare type GetConversationsRequestBody = {};
declare type GetConversationsRequest = TypedRequest<{}, GetConversationsRequestBody, { users: string }>;
declare type GetConversationsResponseBody = { conversations: Array<IConversation> };
declare type GetConversationsResponse = TypedResponse<GetConversationsResponseBody>;

// GET /api/conversations:/conversationId/details
declare type GetConversationDetailsRequestParams = { conversationId: string };
declare type GetConversationDetailsRequest = TypedRequest<GetConversationDetailsRequestParams, {}, {}>;
declare type GetConversationDetailsResponseBody = { conversation: IConversation };
declare type GetConversationDetailsResponse = TypedResponse<GetConversationDetailsResponseBody>;

// POST /api/conversations/:id/sendmessage
declare type SendMessageToConversationRequestBody = { content: string };
declare type SendMessageToConversationRequestParams = { id: string };
declare type SendMessageToConversationRequest = TypedRequest<{}, SendMessageToConversationRequestBody, {}>;
declare type SendMessageToConversationResponseBody = { conversation: IConversation };
declare type SendMessageToConversationResponse = TypedResponse<SendMessageToConversationResponseBody>;

// GET /api/conversations/:id/messages
declare type GetMessagesForConversationRequestParams = { id: string };
declare type GetMessagesForConversationRequest = TypedRequest<GetMessagesForConversationRequestParams, {}, {}>;
declare type GetMessagesForConversationResponseBody = { messages: Array<IMessage> };
declare type GetMessagesForConversationResponse = TypedResponse<GetMessagesForConversationResponseBody>;

/**
 * Uploads
 */

// POST /api/upload/conversations/:conversationId
declare type UploadFileToConversationRequestBody = {};
declare type UploadFileToConversationRequestParams = { conversationId: string };
declare type UploadFileToConversationRequest = TypedRequest<{}, UploadFileToConversationRequestBody, {}>;
declare type UploadFileToConversationResponseBody = { location: string };
declare type UploadFileToConversationResponse = TypedResponse<UploadFileToConversationResponseBody>;

// POST /api/upload/users/:userId/avatar
declare type UploadAvatarRequestBody = {}; // Note: needs to upload an image in FormData called "avatar"
declare type UploadAvatarRequestParams = { userId: string };
declare type UploadAvatarRequest = TypedRequest<{}, UploadAvatarRequestBody, {}>;
declare type UploadAvatarResponseBody = { location: string };
declare type UploadAvatarResponse = TypedResponse<UploadAvatarResponseBody>;
