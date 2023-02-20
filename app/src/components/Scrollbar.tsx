import { SxProps, Theme } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

import SimpleBarReact from 'simplebar-react';

const RootStyle = styled('div')(() => ({
  flexGrow: 1,
  height: '100%',
  overflow: 'hidden',
}));

const SimpleBarStyle = styled(SimpleBarReact)(({ theme }) => ({
  maxHeight: '100%',
  '& .simplebar-scrollbar': {
    '&:before': {
      backgroundColor: alpha(theme.palette.grey[600], 0.48),
    },
    '&.simplebar-visible:before': {
      opacity: 1,
    },
  },
  '& .simplebar-track.simplebar-vertical': {
    width: 10,
  },
  '& .simplebar-track.simplebar-horizontal .simplebar-scrollbar': {
    height: 6,
  },
  '& .simplebar-mask': {
    zIndex: 'inherit',
  },
}));

interface Props {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

export default function Scrollbar({ children, sx, ...other }: Props) {
  return (
    <RootStyle>
      <SimpleBarStyle
        // @ts-ignore
        timeout={500}
        clickOnTrack={false}
        sx={sx}
        {...other}
      >
        {children}
      </SimpleBarStyle>
    </RootStyle>
  );
}

Scrollbar.defaultProps = {
  sx: {},
};
