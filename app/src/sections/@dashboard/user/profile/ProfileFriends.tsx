import {
  Avatar,
  Box,
  Card,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Typography,
} from '@mui/material';

import Iconify from '@src/components/Iconify';
import InputStyle from '@src/components/InputStyle';
import SearchNotFound from '@src/components/SearchNotFound';
import SocialsButton from '@src/components/SocialsButton';

type Friend = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

interface ProfileFriendsProps {
  friends: Friend[];
  findFriends: string;
  onFindFriends: (name: string) => void;
}

interface FriendCardProps {
  friend: Friend;
}

function applyFilter(array: Friend[], query: string) {
  if (query) {
    return array.filter(
      friend => friend.name.toLowerCase().indexOf(query.toLowerCase()) !== -1,
    );
  }

  return array;
}

function FriendCard({ friend }: FriendCardProps) {
  const { name, role, avatarUrl } = friend;

  return (
    <Card
      sx={{
        py: 5,
        display: 'flex',
        position: 'relative',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Avatar
        alt={name}
        src={avatarUrl}
        sx={{ width: 64, height: 64, mb: 3 }}
      />

      <Link variant="subtitle1" color="text.primary">
        {name}
      </Link>

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
        {role}
      </Typography>

      <SocialsButton initialColor />

      <IconButton sx={{ top: 8, right: 8, position: 'absolute' }}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>
    </Card>
  );
}

export default function ProfileFriends({
  friends,
  findFriends,
  onFindFriends,
}: ProfileFriendsProps) {
  const friendFiltered = applyFilter(friends, findFriends);

  const isNotFound = friendFiltered.length === 0;

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Friends
      </Typography>

      <InputStyle
        stretchStart="240"
        value={findFriends}
        onChange={event => onFindFriends(event.target.value)}
        placeholder="Find friends..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 5 }}
      />

      <Grid container spacing={3}>
        {friendFiltered.map(friend => (
          <Grid key={friend.id} item xs={12} md={4}>
            <FriendCard friend={friend} />
          </Grid>
        ))}
      </Grid>

      {isNotFound && (
        <Box sx={{ mt: 5 }}>
          <SearchNotFound searchQuery={findFriends} />
        </Box>
      )}
    </Box>
  );
}
