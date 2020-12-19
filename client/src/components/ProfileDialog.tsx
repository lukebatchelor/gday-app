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
  TextField,
  Typography,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { TransitionProps } from '@material-ui/core/transitions';
import { UserContext } from '../contexts/UserContext';
import { setUserAvatar, setUserDetails } from '../api';
import { navigate, useNavigate } from '@reach/router';

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
  profileUser: IUser;
};
export function ProfileDialog(props: ProfileDialogProps) {
  const classes = useStyles();
  const { isOpen, handleClose, profileUser } = props;
  const [user] = useContext(UserContext);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [imgScale, setImgScale] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [uploadedImg, setUploadedImg] = useState(null);
  const [displayName, setDisplayName] = useState<string>('');
  const navigate = useNavigate();

  const showEditButton = profileUser && user && profileUser.id === user.id;

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
    if (isEditing || showEditButton) {
      if (!isEditing) setIsEditing(true);
      fileInputRef.current.click();
    }
  };
  const closeDialog = () => {
    setIsEditing(false);
    setDisplayName('');
    handleClose();
  };
  const saveAndClose = async () => {
    if (uploadedImg) {
      const res = await setUserAvatar(profileUser.id, uploadedImg);
      if (res && res.location) {
        await setUserDetails(profileUser.id, { displayName: displayName, avatarUrl: res.location });
      }
    } else {
      await setUserDetails(profileUser.id, { displayName: displayName, avatarUrl: profileUser.avatarUrl });
    }
    closeDialog();
  };

  const onDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
  };
  const onEditClicked = () => {
    setIsEditing(true);
  };
  const logout = () => {
    navigate('/sign-in');
  };

  if (!profileUser) return null;

  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={closeDialog}
      maxWidth="xs"
      fullWidth={true}
      aria-labelledby="profile-dialog-title"
      aria-describedby="profile-dialog-text"
    >
      <DialogTitle id="profile-dialog-title">
        <Box display="flex" alignItems="center">
          Profile
          {showEditButton && !isEditing && (
            <Box ml="auto">
              <IconButton onClick={onEditClicked}>
                <EditIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center">
          <IconButton onClick={onUploadClick}>
            <Avatar src={imgSrc || profileUser.avatarUrl} className={classes.avatar} />
          </IconButton>
          <input
            type="file"
            id="file-input-avatar"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={onFileSelect}
          />
          {isEditing ? (
            <Box width="80%">
              <TextField
                label="Display Name"
                placeholder={profileUser.displayName}
                size="medium"
                fullWidth
                onChange={onDisplayNameChange}
                value={displayName}
              />
            </Box>
          ) : (
            <Typography variant="h5">{profileUser.displayName}</Typography>
          )}

          {/* {isEditing && (
            <Box width="80%" mt={4}>
              <Slider
                value={imgScale}
                onChange={handleImgScaleChange}
                min={1}
                max={3}
                step={0.01}
                aria-labelledby="continuous-slider"
              />
            </Box>
          )} */}
        </Box>
      </DialogContent>
      <DialogActions>
        {!isEditing && (
          <Button onClick={logout} color="secondary" style={{ marginRight: 'auto' }}>
            Logout
          </Button>
        )}
        <Button onClick={closeDialog} color="primary">
          {isEditing ? 'Cancel' : 'Close'}
        </Button>
        {isEditing && (
          <Button onClick={saveAndClose} color="primary">
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
