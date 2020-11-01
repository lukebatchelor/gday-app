import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import ChipInput from 'material-ui-chip-input';
import { useForm, Controller } from 'react-hook-form';

const useStyles = makeStyles((theme) => ({}));

type FormValues = { users: Array<string> };
const defaultValues: FormValues = { users: [] };

type ComposeProps = any;
export function Compose(props: ComposeProps) {
  const classes = useStyles();

  const [allUsers, setAllUsers] = useState<Array<string>>([]);
  const { handleSubmit, control, watch } = useForm<FormValues>({ defaultValues });
  const users = watch('users');

  const onComposeSubmit = (data: FormValues) => {
    console.log('Compse submit', data);
  };

  useEffect(() => {}, []);

  return (
    <form noValidate onSubmit={handleSubmit(onComposeSubmit)}>
      <Controller
        control={control}
        name="users"
        render={({ onChange, onBlur, value }) => (
          <ChipInput
            label="Select paticipants"
            variant="outlined"
            helperText="Select people to add to new chat"
            fullWidth
            onAdd={(chip) => onChange([...value, chip])}
            onDelete={(user: string) => onChange(users.filter((val: string) => val !== user))}
            onBlur={onBlur}
            value={value}
          />
        )}
      />
    </form>
  );
}
