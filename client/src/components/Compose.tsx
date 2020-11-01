import React, { useEffect, useState } from 'react';
import { Avatar, Box, Chip, makeStyles, TextField } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import { getAllUsers } from '../api';
import Autocomplete from '@material-ui/lab/Autocomplete/Autocomplete';

const useStyles = makeStyles((theme) => ({}));

type FormValues = { users: Array<string> };
const defaultValues: FormValues = { users: [] };

type ComposeProps = {
  onComposeUserChange: (newUsers: Array<IUser>) => void;
};
export function Compose(props: ComposeProps) {
  const classes = useStyles();
  const { onComposeUserChange } = props;

  const [allUsers, setAllUsers] = useState<Array<IUser>>([]);
  const { handleSubmit, control, watch } = useForm<FormValues>({ defaultValues });

  const onComposeSubmit = (data: FormValues) => {
    console.log('Compose submit', data);
  };

  useEffect(() => {
    (async () => {
      const allUsers = await getAllUsers();
      setAllUsers(allUsers.users);
    })();
  }, []);

  return (
    <form noValidate onSubmit={handleSubmit(onComposeSubmit)}>
      <Controller
        control={control}
        name="users"
        render={({ onChange, value }) => (
          <Autocomplete
            multiple
            options={allUsers}
            getOptionLabel={(option) => option.displayName}
            defaultValue={[]}
            filterSelectedOptions={true}
            limitTags={2}
            value={value}
            onChange={(e: React.ChangeEvent, newUsers) => {
              onChange(newUsers);
              onComposeUserChange(newUsers);
            }}
            renderOption={(option: IUser) => (
              <Box display="flex" alignItems="center">
                <Avatar src={option.avatarUrl}></Avatar>
                <Box mr={2} />
                {option.displayName}
              </Box>
            )}
            renderTags={(value: IUser[], getTagProps) =>
              value.map((user: IUser, index: number) => (
                <Chip
                  key="a"
                  variant="outlined"
                  label={user.displayName}
                  avatar={<Avatar src={user.avatarUrl}></Avatar>}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} variant="filled" label="Select users to add" placeholder="Search..." />
            )}
          />
        )}
      />
    </form>
  );
}
