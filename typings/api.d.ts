declare type TypedRequest<ReqParam = {}, ReqBody = {}, QueryParams = {}> = {
  params: ReqParam;
  body: ReqBody;
  query: QueryParams;
};
declare type TypedResponse<ResBody = any> = ResBody;

// POST /authentication/signup
declare type PostSignupRequestBody = { userName: string; password: string };
declare type PostSignupRequest = TypedRequest<{}, PostSignupRequestBody, {}>;
declare type PostSignupResponseBody = { loggedIn: boolean; user?: IUser };
declare type PostSignupResponse = TypedResponse<PostSignupResponseBody>;

// POST /authentication/login
declare type PostLoginRequestBody = { userName: string; password: string };
declare type PostLoginRequest = TypedRequest<{}, PostLoginRequestBody, {}>;
declare type PostLoginResponseBody = { loggedIn: boolean; user?: IUser };
declare type PostLoginResponse = TypedResponse<PostLoginResponseBody>;
