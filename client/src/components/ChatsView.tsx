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

import SearchIcon from '@material-ui/icons/Search';
import { Controller, useForm } from 'react-hook-form';

const useStyles = makeStyles((theme) => ({
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
  const { isMobile } = props;
  const classes = useStyles();
  const { handleSubmit, control } = useForm<FormValues>({ defaultValues });

  const onSearchSubmit = (data: FormValues) => {
    const { search } = data;
    console.log('Searched for: ', search);
  };

  return (
    <Box>
      {/* <Box className={classes.spacer} /> */}
      <Box p={2} overflow="scroll" width={isMobile ? 'auto' : '35vw'} borderRight={isMobile ? '0px' : '2px solid #eee'}>
        <form noValidate onSubmit={handleSubmit(onSearchSubmit)}>
          <Controller
            control={control}
            name="search"
            render={({ onChange, onBlur, value }) => (
              <TextField
                label="Seach"
                variant="outlined"
                size="medium"
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
          {conversations.map((c, i) => (
            <Box key={`${c}-${i}`} display="flex" marginY={1} alignItems="center">
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
