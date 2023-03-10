import { Fragment, MouseEvent, useState } from 'react';

import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { sentenceCase } from 'change-case';
import { format } from 'date-fns';

import { _bankingRecentTransitions } from '@src/_mock';
import Iconify from '@src/components/Iconify';
import Label from '@src/components/Label';
import MenuPopover from '@src/components/MenuPopover';
import Scrollbar from '@src/components/Scrollbar';
import { fCurrency } from '@src/utils/formatNumber';

interface AvatarIconProps {
  icon: string;
}

function AvatarIcon({ icon }: AvatarIconProps) {
  return (
    <Avatar
      sx={{
        width: 48,
        height: 48,
        color: 'text.secondary',
        bgcolor: 'background.neutral',
      }}
    >
      <Iconify icon={icon} width={24} height={24} />
    </Avatar>
  );
}

function renderAvatar(category: string, avatar: string | null) {
  if (category === 'Books') {
    return <AvatarIcon icon="eva:book-fill" />;
  }
  if (category === 'Beauty & Health') {
    return <AvatarIcon icon="eva:heart-fill" />;
  }
  return avatar ? (
    <Avatar
      alt={category}
      src={avatar}
      sx={{ width: 48, height: 48, boxShadow: theme => theme.customShadows.z8 }}
    />
  ) : null;
}

function MoreMenuButton() {
  const [open, setOpen] = useState<(EventTarget & HTMLButtonElement) | null>(
    null,
  );

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const ICON = {
    mr: 2,
    width: 20,
    height: 20,
  };

  return (
    <>
      <IconButton size="large" onClick={handleOpen}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        arrow="right-top"
        sx={{
          mt: -0.5,
          width: 160,
          '& .MuiMenuItem-root': {
            px: 1,
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <MenuItem>
          <Iconify icon="eva:download-fill" sx={{ ...ICON }} />
          Download
        </MenuItem>

        <MenuItem>
          <Iconify icon="eva:printer-fill" sx={{ ...ICON }} />
          Print
        </MenuItem>

        <MenuItem>
          <Iconify icon="eva:share-fill" sx={{ ...ICON }} />
          Share
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ ...ICON }} />
          Delete
        </MenuItem>
      </MenuPopover>
    </>
  );
}

export default function BankingRecentTransitions() {
  const theme = useTheme();

  const isLight = theme.palette.mode === 'light';

  return (
    <Card>
      <CardHeader title="Recent Transitions" sx={{ mb: 3 }} />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {_bankingRecentTransitions.map(row => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ position: 'relative' }}>
                        {renderAvatar(row.category, row.avatar)}
                        <Box
                          sx={{
                            right: 0,
                            bottom: 0,
                            width: 18,
                            height: 18,
                            display: 'flex',
                            borderRadius: '50%',
                            position: 'absolute',
                            alignItems: 'center',
                            color: 'common.white',
                            bgcolor: 'error.main',
                            justifyContent: 'center',
                            ...(row.type === 'Income' && {
                              bgcolor: 'success.main',
                            }),
                          }}
                        >
                          <Iconify
                            icon={
                              row.type === 'Income'
                                ? 'eva:diagonal-arrow-left-down-fill'
                                : 'eva:diagonal-arrow-right-up-fill'
                            }
                            width={16}
                            height={16}
                          />
                        </Box>
                      </Box>
                      <Box sx={{ ml: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary' }}
                        >
                          {row.message}
                        </Typography>
                        <Typography variant="subtitle2">
                          {' '}
                          {row.category}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography variant="subtitle2">
                      {format(new Date(row.date), 'dd MMM yyyy')}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                      {format(new Date(row.date), 'p')}
                    </Typography>
                  </TableCell>

                  <TableCell>{fCurrency(row.amount)}</TableCell>

                  <TableCell>
                    <Label
                      variant={isLight ? 'ghost' : 'filled'}
                      color={
                        (row.status === 'completed' && 'success') ||
                        (row.status === 'in_progress' && 'warning') ||
                        'error'
                      }
                    >
                      {sentenceCase(row.status)}
                    </Label>
                  </TableCell>

                  <TableCell align="right">
                    <MoreMenuButton />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <Divider />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          size="small"
          color="inherit"
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
        >
          View All
        </Button>
      </Box>
    </Card>
  );
}
