/* eslint-disable no-case-declarations */
import React, { useReducer, useState } from 'react';
/**
 * * get messages in a conversation
 * * put single new message in conversation
 * * put multiple new messages in conversation
 * *
 */
export type ConversationCacheContextType = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

export type State = {
  conversations: Record<string, IConversation>;
  messages: Record<string, Array<IMessage>>;
};
export type Action =
  | { type: 'NEW_MESSAGE'; conversationId: string; message: IMessage }
  | { type: 'ADD_MESSAGES'; conversationId: string; messages: IMessage[] }
  | { type: 'SET_CONVERSATIONS'; conversations: IConversation[] };

const initialState: State = {
  conversations: {},
  messages: {},
};
const initialContext: ConversationCacheContextType = {
  state: initialState,
  dispatch: () => null,
};

const ConversationCacheContext = React.createContext<ConversationCacheContextType>(initialContext);

type Props = {
  children: React.ReactNode;
};
const ConversationCacheContextProvider: React.FC = (props: Props) => {
  const [state, dispatch]: [State, React.Dispatch<Action>] = useReducer((state: State, action: Action) => {
    switch (action.type) {
      case 'NEW_MESSAGE':
        const { conversationId } = action;
        return {
          ...state,
          messages: {
            ...state.messages,
            [conversationId]: [...state.messages[conversationId], action.message],
          },
          conversations: {
            ...state.conversations,
            [conversationId]: {
              ...state.conversations[conversationId],
              lastMessage: action.message,
            },
          },
        };
      case 'ADD_MESSAGES': {
        const { conversationId } = action;
        const { messages } = action;
        const newState = { ...state };
        // filter out any duplicates by looking at their timestamps
        // TODO: Replace with a sequential messageId
        const curMessages = newState.messages[conversationId] || [];
        newState.messages[conversationId] = [...curMessages, ...messages].filter(
          (el: IMessage, idx, arr: IMessage[]) => arr.findIndex((innerEl) => innerEl.timestamp === el.timestamp) === idx
        );
        // TODO: create conversations
        // if (!newState.conversations[conversationId]) newState.conversations[conversationId] = {};
        // newState.conversations[conversationId].lastMessage = messages[action.messages.length - 1];
        return newState;
      }
      case 'SET_CONVERSATIONS': {
        const conversations = Object.fromEntries(action.conversations.map(({ id, ...rest }) => [id, { id, ...rest }]));
        return {
          ...state,
          conversations,
        };
      }
      default:
        throw new Error();
    }
  }, initialState);

  return (
    <ConversationCacheContext.Provider value={{ state, dispatch }}>{props.children}</ConversationCacheContext.Provider>
  );
};

export { ConversationCacheContext, ConversationCacheContextProvider };
