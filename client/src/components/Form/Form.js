import React, { useState, useEffect } from 'react';
import useStyles from './styles';
import { Paper, TextField, Button, Typography, Box } from '@material-ui/core';
import FileBase from 'react-file-base64';
import { useDispatch, useSelector} from 'react-redux';
import { createPost, updatePost } from '../../actions/posts';
import { useNavigate } from 'react-router-dom';
//GET THE CURRENT ID

const Form = ({ currentId, setCurrentId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate =  useNavigate();
  const [postData, setPostData] = useState({
    title: '',
    message: '',
    tags: '',
    selectedFile: '',
  });
  const post = useSelector((state) =>
    currentId ? state.posts.posts.find((p) => p._id === currentId) : null
  );

  const user = JSON.parse(localStorage.getItem('profile'));
  


  useEffect(() => {
    if (post) setPostData(post);
  }, [post]);

  //dispatch
  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentId) {
      //currentId exists -> update
      dispatch(updatePost(currentId, {...postData, name: user?.result?.name }));
    } else {
      //Id null -> new post
      dispatch(createPost({...postData, name: user?.result?.name }, navigate))
    }
    //clear Form
    clear();
  };

  
  if(!user?.result?.name) {
    return (
      <Paper className={classes.paper}>
        <Typography variant='h6' align='center'>
          Please Sign in to create your own posts and like, edit the post
        </Typography>
      </Paper>
    )
  }


  const clear = () => {
    setCurrentId(0);
    setPostData({
      title: '',
      message: '',
      tags: '',
      selectedFile: '',
    });
  };

  return (
    <Paper className={classes.paper} elevation={6}>
      <form
        autoComplete='off'
        noValidate
        className={`${classes.root} ${classes.form}`}
        onSubmit={handleSubmit}
      >
        <Typography variant='h6'>
          {currentId ? `Editing` : `Creating`} a Memory
        </Typography>
        {/* <TextField
          name='creator'
          variant='outlined'
          label='Creator'
          fullWidth
          value={postData.creator}
          onChange={(e) =>
            setPostData({ ...postData, creator: e.target.value })
          }
        /> */}
        <TextField
          name='title'
          variant='outlined'
          label='Title'
          fullWidth
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        />
        <TextField
          name='message'
          variant='outlined'
          label='Message'
          fullWidth
          multiline
          minRows={6}
          value={postData.message}
          onChange={(e) =>
            setPostData({ ...postData, message: e.target.value })
          }
        />
        <TextField
          name='tags'
          variant='outlined'
          label='Tags'
          placeholder='tags are split by comma'
          fullWidth
          value={postData.tags}
          onChange={(e) =>
            setPostData({ ...postData, tags: e.target.value.split(',') })
          }
        />
        <div className={classes.fileInput}>
          <FileBase
            type='file'
            multiple={false}
            onDone={({ base64 }) =>
              setPostData({ ...postData, selectedFile: base64 })
            }
          />
        </div>
        <Button
          variant='contained'
          color='primary'
          size='large'
          type='submit'
          fullWidth
        >
          Sumbit
        </Button>
        <Box className={classes.clearButton} my={1}>
          <Button
            variant='contained'
            color='secondary'
            size='small'
            onClick={clear}
            fullWidth
          >
            Clear
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default Form;
