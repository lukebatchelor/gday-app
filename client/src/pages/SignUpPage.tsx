import React from 'react';
import { makeStyles } from '@material-ui/core';
import { RouteComponentProps } from '@reach/router';

const useStyles = makeStyles((theme) => ({}));

type SignUpPageProps = RouteComponentProps;
export function SignUpPage(props: SignUpPageProps) {
  const classes = useStyles();

  return <div>SignUpPage</div>;
}
