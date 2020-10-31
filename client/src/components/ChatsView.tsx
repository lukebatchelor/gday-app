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
import { Controller, useForm } from 'react-hook-form';

const useStyles = makeStyles((theme) => ({
  composeButton: {
    marginLeft: 'auto',
  },
  spacer: {
    marginTop: theme.spacing(8),
  },
  messageText: {
    flexGrow: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'pre',
  },
  messageTimeStamp: {
    // marginLeft: 'auto',
  },
}));

type FormValues = { search: string };
const defaultValues = { search: '' };

const conversations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 12, 3, 4, 5, 6, 7, 8, 9];

type ChatsViewProps = {
  isMobile: boolean;
};
export function ChatsView(props: ChatsViewProps) {
  const classes = useStyles();
  const { handleSubmit, control } = useForm<FormValues>({ defaultValues });

  const onSearchSubmit = (data: FormValues) => {
    const { search } = data;
    console.log('Searched for: ', search);
  };

  return (
    <Box>
      <AppBar position="relative">
        <Toolbar>
          <Avatar>
            <PersonIcon />
          </Avatar>
          <Box mr={2} />
          <Typography variant="h5">Chats</Typography>
          <IconButton
            aria-label="Compose new message"
            // onClick={() => {}}
            color="inherit"
            size="small"
            className={classes.composeButton}
          >
            <CreateIcon fontSize="small" />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* <Box className={classes.spacer} /> */}
      <Box p={2}>
        <form noValidate onSubmit={handleSubmit(onSearchSubmit)}>
          <Controller
            control={control}
            name="search"
            render={({ onChange, onBlur, value }) => (
              <TextField
                label="Seach"
                variant="outlined"
                size="small"
                fullWidth
                margin="normal"
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </form>

        <Box mt={2} display="flex" flexDirection="column">
          {conversations.map((c) => (
            <Box key={c} display="flex" marginY={1} alignItems="center">
              <Avatar></Avatar>
              <Box ml={2} display="flex" flexDirection="column" style={{ flex: '1', minWidth: 0 }}>
                <Typography>Chat name</Typography>
                <Box display="flex">
                  <Typography className={classes.messageText}>
                    You: last message will {c % 4 === 0 ? ' asd;fklja daf;lkj ad asd;lfkj' : ''}
                  </Typography>
                  <Typography className={classes.messageTimeStamp}>12:24pm</Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
