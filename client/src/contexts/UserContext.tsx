/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState } from 'react';

type User = IUser & { loggedIn: boolean };
type UserContextType = [User, (user: User) => void];
const defaultUser: User = { isAdmin: false, userName: '', displayName: '', id: '', loggedIn: false };
const UserContext = React.createContext<UserContextType>([defaultUser, () => {}]);

type Props = {
  children: React.ReactNode;
};
const UserContextProvider: React.FC = (props: Props) => {
  const [user, setUser] = useState<User>(defaultUser);

  return <UserContext.Provider value={[user, setUser]}>{props.children}</UserContext.Provider>;
};

export { UserContext, UserContextProvider };
