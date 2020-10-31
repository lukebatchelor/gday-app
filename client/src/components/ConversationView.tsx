import React from 'react';
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
const useStyles = makeStyles((theme) => ({
  composeButton: {
    marginLeft: 'auto',
  },
}));

type FormValues = { chat: string };
const defaultValues = { chat: '' };

type ConversationViewProps = {
  isMobile: boolean;
};
export function ConversationView(props: ConversationViewProps) {
  const classes = useStyles();

  const { handleSubmit, control } = useForm<FormValues>({ defaultValues });

  const onChatSubmit = (data: FormValues) => {
    console.log('chat submit', data);
  };

  return (
    <Box flexGrow={1} display="flex" flexDirection="column" p={2}>
      <Box flexGrow={1}></Box>
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
