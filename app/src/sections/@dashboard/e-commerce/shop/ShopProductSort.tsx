import { Fragment, useState } from 'react';

import { Button, MenuItem, Typography } from '@mui/material';

import Iconify from '@src/components/Iconify';
import MenuPopover from '@src/components/MenuPopover';
import { useAppDispatch } from '@src/hooks/useAppDispatch';
import { useAppSelector } from '@src/hooks/useAppSelector';
import { sortByProducts } from '@src/store/product/product.slice';

const SORT_BY_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'priceDesc', label: 'Price: High-Low' },
  { value: 'priceAsc', label: 'Price: Low-High' },
];

function renderLabel(label: string) {
  if (label === 'featured') {
    return 'Featured';
  }
  if (label === 'newest') {
    return 'Newest';
  }
  if (label === 'priceDesc') {
    return 'Price: High-Low';
  }
  return 'Price: Low-High';
}

export default function ShopProductSort() {
  const dispatch = useAppDispatch();

  const { sortBy } = useAppSelector(state => state.product);

  const [open, setOpen] = useState(null);

  const handleOpen = currentTarget => {
    setOpen(currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleSortBy = value => {
    handleClose();
    dispatch(sortByProducts(value));
  };

  return (
    <>
      <Button
        color="inherit"
        disableRipple
        onClick={event => handleOpen(event.currentTarget)}
        endIcon={
          <Iconify
            icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'}
          />
        }
      >
        Sort By:&nbsp;
        <Typography
          component="span"
          variant="subtitle2"
          sx={{ color: 'text.secondary' }}
        >
          {renderLabel(sortBy)}
        </Typography>
      </Button>

      <MenuPopover
        anchorEl={open}
        open={Boolean(open)}
        onClose={handleClose}
        sx={{
          width: 'auto',
          '& .MuiMenuItem-root': { typography: 'body2', borderRadius: 0.75 },
        }}
      >
        {SORT_BY_OPTIONS.map(option => (
          <MenuItem
            key={option.value}
            selected={option.value === sortBy}
            onClick={() => handleSortBy(option.value)}
          >
            {option.label}
          </MenuItem>
        ))}
      </MenuPopover>
    </>
  );
}
