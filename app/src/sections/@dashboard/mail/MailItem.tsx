import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';

import { Box, Checkbox, Link, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import Avatar from '@src/components/Avatar';
import Iconify from '@src/components/Iconify';
import Label from '@src/components/Label';
import { useAppSelector } from '@src/hooks/useAppSelector';
import useResponsive from '@src/hooks/useResponsive';
import { PATH_DASHBOARD } from '@src/routes/paths';
import createAvatar from '@src/utils/createAvatar';
import { fDate } from '@src/utils/formatTime.util';

import MailItemAction from './MailItemAction';

const RootStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(0, 2),
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.neutral,
  borderBottom: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.up('md')]: { display: 'flex', alignItems: 'center' },
  '&:hover': {
    zIndex: 999,
    position: 'relative',
    boxShadow: theme.customShadows.z24,
    '& .showActions': { opacity: 1 },
  },
}));

const WrapStyle = styled(Link)(({ theme }) => ({
  minWidth: 0,
  display: 'flex',
  padding: theme.spacing(2, 0),
  transition: theme.transitions.create('padding'),
}));

const linkTo = (
  params: { systemLabel: string; customLabel: string },
  mailId: string,
) => {
  const { systemLabel, customLabel } = params;

  const baseUrl = PATH_DASHBOARD.mail.root;

  if (systemLabel) {
    return `${baseUrl}/${systemLabel}/${mailId}`;
  }
  if (customLabel) {
    return `${baseUrl}/label/${customLabel}/${mailId}`;
  }
  return baseUrl;
};

interface MailItemProps {
  mail: {
    id: string;
    from: {
      name: string;
      email: string;
      avatar: string;
    };
    to: {
      name: string;
      email: string;
      avatar: string;
    }[];
    createdAt: Date;
    files: string[];
    isUnread: boolean;
    isStarred: boolean;
    isImportant: boolean;
    subject: string;
    message: string;
    labelIds: string[];
  };
  isDense: boolean;
  isSelected: boolean;
  onDeselect: () => void;
  onSelect: () => void;
}

export default function MailItem({
  mail,
  isDense,
  isSelected,
  onSelect,
  onDeselect,
  ...other
}: MailItemProps) {
  const params = useParams();

  const { labels } = useAppSelector(state => state.mail);

  const isDesktop = useResponsive('up', 'md');

  const isAttached = mail.files.length > 0;

  const handleChangeCheckbox = (checked: boolean) =>
    checked ? onSelect() : onDeselect();

  return (
    <RootStyle
      sx={{
        ...(!mail.isUnread && {
          color: 'text.primary',
          backgroundColor: 'background.paper',
        }),
        ...(isSelected && { bgcolor: 'action.selected' }),
      }}
      {...other}
    >
      {isDesktop && (
        <Box sx={{ mr: 2, display: 'flex' }}>
          <Checkbox
            checked={isSelected}
            onChange={event => handleChangeCheckbox(event.target.checked)}
          />
          <Tooltip title="Starred">
            <Checkbox
              color="warning"
              defaultChecked={mail.isStarred}
              icon={<Iconify icon="eva:star-outline" />}
              checkedIcon={<Iconify icon="eva:star-fill" />}
            />
          </Tooltip>
          <Tooltip title="Important">
            <Checkbox
              color="warning"
              defaultChecked={mail.isImportant}
              checkedIcon={<Iconify icon="ic:round-label-important" />}
              icon={<Iconify icon="ic:round-label-important" />}
            />
          </Tooltip>
        </Box>
      )}

      <WrapStyle
        color="inherit"
        underline="none"
        component={RouterLink}
        to={linkTo(params, mail.id)}
        sx={{ ...(isDense && { py: 1 }) }}
      >
        <Avatar
          alt={mail.from.name}
          src={mail.from.avatar || ''}
          color={createAvatar(mail.from.name).color}
          sx={{ width: 32, height: 32 }}
        >
          {createAvatar(mail.from.name).name}
        </Avatar>

        <Box
          sx={{
            ml: 2,
            minWidth: 0,
            alignItems: 'center',
            display: { md: 'flex' },
          }}
        >
          <Typography
            variant="body2"
            noWrap
            sx={{
              pr: 2,
              minWidth: 200,
              ...(!mail.isUnread && { fontWeight: 'fontWeightBold' }),
            }}
          >
            {mail.from.name}
          </Typography>

          <Typography
            noWrap
            variant="body2"
            sx={{
              pr: 2,
            }}
          >
            <Box
              component="span"
              sx={{ ...(!mail.isUnread && { fontWeight: 'fontWeightBold' }) }}
            >
              {mail.subject}
            </Box>
            &nbsp;-&nbsp;
            <Box
              component="span"
              sx={{
                ...(!mail.isUnread && { color: 'text.secondary' }),
              }}
            >
              {mail.message}
            </Box>
          </Typography>

          {isDesktop && (
            <>
              <Box sx={{ display: 'flex' }}>
                {mail.labelIds.map(labelId => {
                  const label = labels.find(_label => _label.id === labelId);
                  if (!label) return null;
                  return (
                    <Label
                      key={label.id}
                      sx={{
                        mx: 0.5,
                        textTransform: 'capitalize',
                        bgcolor: label.color,
                        color: theme =>
                          theme.palette.getContrastText(label.color || ''),
                      }}
                    >
                      {label.name}
                    </Label>
                  );
                })}
              </Box>

              {isAttached && (
                <Iconify
                  icon="eva:link-fill"
                  sx={{
                    mx: 2,
                    width: 20,
                    height: 20,
                    flexShrink: 0,
                  }}
                />
              )}
            </>
          )}

          <Typography
            variant="caption"
            sx={{
              flexShrink: 0,
              minWidth: 120,
              textAlign: 'right',
              ...(!mail.isUnread && { fontWeight: 'fontWeightBold' }),
            }}
          >
            {fDate(mail.createdAt)}
          </Typography>
        </Box>
      </WrapStyle>

      <MailItemAction className="showActions" />
    </RootStyle>
  );
}
