import React, { useContext, useEffect, useRef, useState } from 'react';
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
import { setConversationDetails, setUserAvatar, setUserDetails, uploadConversationFile } from '../api';
import { ConversationCacheContext } from '../contexts/ConversationCacheContext';

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

type ConversationInfoDialogProps = {
  isOpen: boolean;
  handleClose: () => void;
  conversationId: string;
};
export function ConversationInfoDialog(props: ConversationInfoDialogProps) {
  const classes = useStyles();
  const { isOpen, handleClose, conversationId } = props;
  const [user] = useContext(UserContext);
  const { state, dispatch } = useContext(ConversationCacheContext);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [imgScale, setImgScale] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [uploadedImg, setUploadedImg] = useState(null);
  const [conversationName, setConversationName] = useState<string>('');
  const conversation = state.conversations[conversationId];

  useEffect(() => {
    if (conversation) setConversationName(conversation.name);
  }, [conversation]);

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
    if (isEditing) {
      if (!isEditing) setIsEditing(true);
      fileInputRef.current.click();
    }
  };
  const closeDialog = () => {
    setIsEditing(false);
    setConversationName('');
    handleClose();
  };
  const saveAndClose = async () => {
    if (uploadedImg) {
      const res = await uploadConversationFile(conversationId, uploadedImg);
      if (res && res.location) {
        const conversationDetails = { avatarUrl: res.location, name: conversationName };
        await setConversationDetails(conversationId, conversationDetails);
        dispatch({ type: 'SET_CONVERSATION', conversation: { ...conversation, ...conversationDetails } });
      }
    } else {
      const conversationDetails = { avatarUrl: conversation.avatarUrl, name: conversationName };
      await setConversationDetails(conversationId, conversationDetails);
      dispatch({ type: 'SET_CONVERSATION', conversation: { ...conversation, ...conversationDetails } });
    }
    closeDialog();
  };

  const onConversationNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConversationName(e.target.value);
  };
  const onEditClicked = () => {
    setIsEditing(true);
  };

  if (!conversation) return null;

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
          {conversation.name}
          {!isEditing && (
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
            <Avatar src={imgSrc || conversation.avatarUrl} className={classes.avatar} />
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
                label="Conversation Name"
                placeholder={conversation.name}
                size="medium"
                fullWidth
                onChange={onConversationNameChange}
                value={conversationName}
              />
            </Box>
          ) : (
            <Typography variant="h5">{conversation.name}</Typography>
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
