import { Box, Container } from '@mui/material';

import { _userCards } from '@src/_mock';
import HeaderBreadcrumbs from '@src/components/HeaderBreadcrumbs';
import Page from '@src/components/Page';
import { useAppSelector } from '@src/hooks/useAppSelector';
import { PATH_DASHBOARD } from '@src/routes/paths';
import { UserCard } from '@src/sections/@dashboard/user/cards';

export default function UserCards() {
  const themeStretch = useAppSelector(state => state.settings.themeStretch);

  return (
    <Page title="User: Cards">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="User Cards"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: 'Cards' },
          ]}
        />

        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
          }}
        >
          {_userCards.map(user => (
            <UserCard key={user.id} user={user} />
          ))}
        </Box>
      </Container>
    </Page>
  );
}
