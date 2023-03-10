import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Box, Divider, Stack } from '@mui/material';

import { useAppDispatch } from '@src/hooks/useAppDispatch';
import { useAppSelector } from '@src/hooks/useAppSelector';
import { PATH_DASHBOARD } from '@src/routes/paths';
import {
  addRecipients,
  getConversation,
  getParticipants,
  markConversationAsRead,
  onSendMessage,
  resetActiveConversation,
} from '@src/store/chat/chat.slice';
import { RootState } from '@src/store/types';

import ChatHeaderCompose from './ChatHeaderCompose';
import ChatHeaderDetail from './ChatHeaderDetail';
import ChatMessageInput from './ChatMessageInput';
import ChatMessageList from './ChatMessageList';
import ChatRoom from './ChatRoom';

const conversationSelector = (state: RootState) => {
  const { conversations, activeConversationId } = state.chat;
  const conversation = activeConversationId
    ? conversations.byId[activeConversationId]
    : null;
  if (conversation) {
    return conversation;
  }
  const initState = {
    id: '',
    messages: [],
    participants: [],
    unreadCount: 0,
    type: '',
  };
  return initState;
};

export default function ChatWindow() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { conversationKey } = useParams();
  const { contacts, recipients, participants, activeConversationId } =
    useAppSelector(state => state.chat);
  const conversation = useAppSelector(state => conversationSelector(state));

  const mode = conversationKey ? 'DETAIL' : 'COMPOSE';
  const displayParticipants = participants.filter(
    item => item.id !== '8864c717-587d-472a-929a-8e5f298024da-0',
  );

  const handleAddRecipients = (recipients: any[]) => {
    dispatch(addRecipients(recipients));
  };

  const handleSendMessage = async (value: string) => {
    try {
      dispatch(onSendMessage(value));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getDetails = async () => {
      dispatch(getParticipants(conversationKey));
      try {
        await dispatch(getConversation(conversationKey));
      } catch (error) {
        console.error(error);
        navigate(PATH_DASHBOARD.chat.new);
      }
    };
    if (conversationKey) {
      getDetails();
    } else if (activeConversationId) {
      dispatch(resetActiveConversation());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationKey]);

  useEffect(() => {
    if (activeConversationId) {
      dispatch(markConversationAsRead(activeConversationId));
    }
  }, [dispatch, activeConversationId]);
  return (
    <Stack sx={{ flexGrow: 1, minWidth: '1px' }}>
      {mode === 'DETAIL' ? (
        <ChatHeaderDetail participants={displayParticipants} />
      ) : (
        <ChatHeaderCompose
          recipients={recipients}
          contacts={Object.values(contacts.byId)}
          onAddRecipients={handleAddRecipients}
        />
      )}

      <Divider />

      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        <Stack sx={{ flexGrow: 1 }}>
          <ChatMessageList conversation={conversation} />

          <Divider />

          <ChatMessageInput
            conversationId={activeConversationId}
            onSend={handleSendMessage}
            disabled={pathname === PATH_DASHBOARD.chat.new}
          />
        </Stack>

        {mode === 'DETAIL' && (
          <ChatRoom
            conversation={conversation}
            participants={displayParticipants}
          />
        )}
      </Box>
    </Stack>
  );
}
