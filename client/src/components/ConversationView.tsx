import React, { useRef } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  makeStyles,
  TextField,
  Toolbar,
  Typography,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import CreateIcon from '@material-ui/icons/Create';
import SearchIcon from '@material-ui/icons/Search';
import { useForm, Controller } from 'react-hook-form';
import { Compose } from './Compose';
import { createConversation, sendMessage } from '../api';
import { useNavigate } from '@reach/router';
const useStyles = makeStyles((theme) => ({
  composeButton: {
    marginLeft: 'auto',
  },
}));

type FormValues = { chat: string };
const defaultValues: FormValues = { chat: '' };

type ConversationViewProps = {
  isMobile: boolean;
  isComposing: boolean;
  conversationId?: string;
};
export function ConversationView(props: ConversationViewProps) {
  const { isComposing, conversationId } = props;
  const classes = useStyles();
  const navigate = useNavigate();
  const composeUsersRef = useRef<Array<IUser>>([]);

  const { handleSubmit, control, watch } = useForm<FormValues>({ defaultValues });
  const chatContent = watch('chat');

  const onChatSubmit = async (data: FormValues) => {
    console.log('chat submit', data);
    if (isComposing) {
      const res = await createConversation(composeUsersRef.current);
      console.log(res);
      if (res.conversation && res.conversation.id) {
        navigate(`/${res.conversation.id}`);
      }
    } else {
      if (conversationId && chatContent) {
        const res = await sendMessage(conversationId, chatContent);
        console.log(res);
      }
    }
  };
  const onComposeUserChange = (newUsers: Array<IUser>) => {
    composeUsersRef.current = newUsers;
  };

  return (
    <Box flexGrow={1} display="flex" flexDirection="column" p={2}>
      <Box flexGrow={1}>
        {isComposing && (
          <Box>
            <Compose onComposeUserChange={onComposeUserChange} />
          </Box>
        )}
        {!isComposing && <Box>Messages go here</Box>}
      </Box>
      <Box>
        <form noValidate onSubmit={handleSubmit(onChatSubmit)}>
          <Controller
            control={control}
            name="chat"
            render={({ onChange, onBlur, value }) => (
              <TextField
                placeholder="Type a message..."
                variant="outlined"
                size="medium"
                fullWidth
                onChange={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
          />
        </form>
      </Box>
    </Box>
  );
}
