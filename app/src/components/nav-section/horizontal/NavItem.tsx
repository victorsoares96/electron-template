/* eslint-disable react/require-default-props */
/* eslint-disable react/no-children-prop */
/* eslint-disable react/display-name */
import { Fragment, forwardRef } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';

import { Box, Link } from '@mui/material';

import { isExternalLink } from '..';
import { ICON } from '../../../config';
import Iconify from '../../Iconify';
import { ListItemStyle } from './style';

interface NavItemSubProps {
  active: boolean;
  open?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  item: {
    children: React.ReactNode;
    icon: any;
    path: string;
    title: string;
  };
}

interface NavItemContentProps {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  subItem?: boolean;
  title: string;
}

interface NavItemRootProps {
  active: boolean;
  open?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  item: {
    children: React.ReactNode[];
    icon: any;
    path: string;
    title: string;
  };
}

function NavItemContent({
  icon,
  title,
  children,
  subItem,
}: NavItemContentProps) {
  return (
    <>
      {icon && (
        <Box
          component="span"
          sx={{
            mr: 1,
            width: ICON.NAVBAR_ITEM_HORIZONTAL,
            height: ICON.NAVBAR_ITEM_HORIZONTAL,
            '& svg': { width: '100%', height: '100%' },
          }}
        >
          {icon}
        </Box>
      )}

      {title}

      {children && (
        <Iconify
          icon={subItem ? 'eva:chevron-right-fill' : 'eva:chevron-down-fill'}
          sx={{
            ml: 0.5,
            width: ICON.NAVBAR_ITEM_HORIZONTAL,
            height: ICON.NAVBAR_ITEM_HORIZONTAL,
          }}
        />
      )}
    </>
  );
}

export const NavItemSub = forwardRef<HTMLButtonElement, NavItemSubProps>(
  ({ item, active, open, onMouseEnter, onMouseLeave }, ref) => {
    const { title, path, icon, children } = item;

    if (children) {
      return (
        <ListItemStyle
          ref={ref}
          // @ts-ignore
          subItem
          disableRipple
          open={open}
          activeSub={active}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <NavItemContent icon={icon} title={title} subItem>
            {children}
          </NavItemContent>
        </ListItemStyle>
      );
    }

    return isExternalLink(path) ? (
      <ListItemStyle
        // @ts-ignore
        subItem
        href={path}
        disableRipple
        rel="noopener"
        target="_blank"
        component={Link}
      >
        <NavItemContent icon={icon} title={title} subItem>
          {children}
        </NavItemContent>
      </ListItemStyle>
    ) : (
      <ListItemStyle
        disableRipple
        // @ts-ignore
        component={RouterLink}
        to={path}
        activeSub={active}
        subItem
      >
        <NavItemContent icon={icon} title={title} subItem>
          {children}
        </NavItemContent>
      </ListItemStyle>
    );
  },
);

export const NavItemRoot = forwardRef<HTMLButtonElement, NavItemRootProps>(
  ({ item, active, open, onMouseEnter, onMouseLeave }, ref) => {
    const { title, path, icon, children } = item;

    if (children) {
      return (
        <ListItemStyle
          ref={ref}
          // @ts-ignore
          open={open}
          activeRoot={active}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <NavItemContent icon={icon} title={title} children={children} />
        </ListItemStyle>
      );
    }

    return isExternalLink(path) ? (
      <ListItemStyle
        // @ts-ignore
        component={Link}
        // @ts-ignore
        href={path}
        target="_blank"
        rel="noopener"
      >
        <NavItemContent icon={icon} title={title} children={children} />
      </ListItemStyle>
    ) : (
      <ListItemStyle
        // @ts-ignore
        component={RouterLink}
        to={path}
        activeRoot={active}
      >
        <NavItemContent icon={icon} title={title} children={children} />
      </ListItemStyle>
    );
  },
);

NavItemContent.defaultProps = {
  children: undefined,
  icon: undefined,
};
