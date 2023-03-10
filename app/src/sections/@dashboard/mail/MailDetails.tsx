import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Box, Divider, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import Markdown from '@src/components/Markdown';
import Scrollbar from '@src/components/Scrollbar';
import { useAppDispatch } from '@src/hooks/useAppDispatch';
import { useAppSelector } from '@src/hooks/useAppSelector';
import { getMail } from '@src/store/mail/mail.slice';

import MailDetailsAttachments from './MailDetailsAttachments';
import MailDetailsReplyInput from './MailDetailsReplyInput';
import MailDetailsToolbar from './MailDetailsToolbar';

const RootStyle = styled('div')({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
});

const MarkdownStyle = styled('div')(({ theme }) => ({
  '& > p': {
    ...theme.typography.body1,
    marginBottom: theme.spacing(2),
  },
}));

export default function MailDetails() {
  const { mailId } = useParams();
  const dispatch = useAppDispatch();
  const mail = useAppSelector(state => state.mail.mails.byId[mailId as string]);
  const isAttached = mail && mail.files.length > 0;

  useEffect(() => {
    dispatch(getMail(mailId as string));
  }, [dispatch, mailId]);

  if (!mail) {
    return null;
  }

  return (
    <RootStyle>
      <MailDetailsToolbar mail={mail} />

      <Divider />

      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ p: { xs: 3, md: 5 } }}>
          <Typography variant="h3" gutterBottom>
            {mail.subject}
          </Typography>
          <MarkdownStyle>
            <Markdown children={mail.message} />
          </MarkdownStyle>
        </Box>
      </Scrollbar>

      {isAttached && <MailDetailsAttachments mail={mail} />}

      <Divider />

      <MailDetailsReplyInput />
    </RootStyle>
  );
}
