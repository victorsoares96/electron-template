import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Box, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

import EmptyContent from '@src/components/EmptyContent';
import Scrollbar from '@src/components/Scrollbar';
import { useAppDispatch } from '@src/hooks/useAppDispatch';
import { useAppSelector } from '@src/hooks/useAppSelector';
import { getMails } from '@src/store/mail/mail.slice';

import MailItem from './MailItem';
import MailToolbar from './MailToolbar';

const RootStyle = styled('div')({
  flexGrow: 1,
  display: 'flex',
  overflow: 'hidden',
  flexDirection: 'column',
});

interface MailListProps {
  onOpenSidebar: () => void;
}

export default function MailList({ onOpenSidebar }: MailListProps) {
  const params = useParams();

  const dispatch = useAppDispatch();

  const { mails } = useAppSelector(state => state.mail);

  const [selectedMails, setSelectedMails] = useState([]);

  const [dense, setDense] = useState(false);

  const isEmpty = mails.allIds.length < 1;

  useEffect(() => {
    dispatch(getMails(params));
  }, [dispatch, params]);

  const handleSelectAllMails = () => {
    setSelectedMails(mails.allIds.map(mailId => mailId));
  };

  const handleToggleDense = () => {
    setDense(prev => !prev);
  };

  const handleDeselectAllMails = () => {
    setSelectedMails([]);
  };

  const handleSelectOneMail = (mailId: string) => {
    setSelectedMails(prevSelectedMails => {
      if (!prevSelectedMails.includes(mailId)) {
        return [...prevSelectedMails, mailId];
      }
      return prevSelectedMails;
    });
  };

  const handleDeselectOneMail = (mailId: string) => {
    setSelectedMails(prevSelectedMails =>
      prevSelectedMails.filter(id => id !== mailId),
    );
  };

  return (
    <RootStyle>
      <MailToolbar
        mails={mails.allIds.length}
        selectedMails={selectedMails.length}
        onSelectAll={handleSelectAllMails}
        onOpenSidebar={onOpenSidebar}
        onDeselectAll={handleDeselectAllMails}
        onToggleDense={handleToggleDense}
      />

      <Divider />

      {!isEmpty ? (
        <Scrollbar>
          <Box sx={{ minWidth: { md: 800 } }}>
            {mails.allIds.map(mailId => (
              <MailItem
                key={mailId}
                isDense={dense}
                mail={mails.byId[mailId]}
                isSelected={selectedMails.includes(mailId)}
                onSelect={() => handleSelectOneMail(mailId)}
                onDeselect={() => handleDeselectOneMail(mailId)}
              />
            ))}
          </Box>
        </Scrollbar>
      ) : (
        <EmptyContent
          title="There is no conversation"
          img="https://minimal-assets-api.vercel.app/assets/illustrations/illustration_empty_mail.svg"
          sx={{ flexGrow: 1, height: 'auto' }}
        />
      )}
    </RootStyle>
  );
}
