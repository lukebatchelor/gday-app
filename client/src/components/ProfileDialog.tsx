import React, { useContext, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  makeStyles,
  Slide,
  Slider,
  Typography,
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { UserContext } from '../contexts/UserContext';
import { setUserAvatar, setUserDetails } from '../api';

const useStyles = makeStyles((theme) => ({
  avatar: {
    height: theme.spacing(16),
    width: theme.spacing(16),
  },
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type ProfileDialogProps = {
  isOpen: boolean;
  handleClose: () => void;
};
export function ProfileDialog(props: ProfileDialogProps) {
  const classes = useStyles();
  const { isOpen, handleClose } = props;
  const [user] = useContext(UserContext);
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [imgScale, setImgScale] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [uploadedImg, setUploadedImg] = useState(null);

  const handleImgScaleChange = (e: any, newScale: number) => {
    setImgScale(newScale);
  };
  const onFileLoaded = (e: any) => {
    setImgSrc(e.target.result);
  };
  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files.length !== 1) {
      alert('Error: Expected exactly 1 file');
      return;
    }
    if (!files[0].type.startsWith('image/')) {
      alert('Error: Expected an image file');
      return;
    }
    const image = files[0];
    setUploadedImg(image);
    const fileReader = new FileReader();
    fileReader.onload = onFileLoaded;
    fileReader.readAsDataURL(image);
  };
  const onUploadClick = () => {
    fileInputRef.current.click();
  };
  const saveAndClose = async () => {
    if (uploadedImg) {
      const res = await setUserAvatar(user.id, uploadedImg);
      console.log('here', res);
      if (res && res.location) {
        await setUserDetails(user.id, { displayName: user.displayName, avatarUrl: res.location });
      }
    }
    handleClose();
  };

  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      maxWidth="xs"
      fullWidth={true}
      aria-labelledby="profile-dialog-title"
      aria-describedby="profile-dialog-text"
    >
      <DialogTitle id="profile-dialog-title">Profile</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center">
          <IconButton onClick={onUploadClick}>
            <Avatar src={imgSrc || user.avatarUrl} className={classes.avatar} />
          </IconButton>
          <input
            type="file"
            id="file-input-avatar"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={onFileSelect}
          />
          <DialogContentText id="profile-dialog-text">
            <Typography variant="h5">{user.displayName}</Typography>
          </DialogContentText>
          <Box width="80%">
            <Slider
              value={imgScale}
              onChange={handleImgScaleChange}
              min={1}
              max={3}
              step={0.01}
              aria-labelledby="continuous-slider"
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={saveAndClose} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
