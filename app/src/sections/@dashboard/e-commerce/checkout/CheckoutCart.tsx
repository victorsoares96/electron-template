import { Link as RouterLink } from 'react-router-dom';

import { Button, Card, CardHeader, Grid, Typography } from '@mui/material';

import sum from 'lodash/sum';

import EmptyContent from '@src/components/EmptyContent';
import Iconify from '@src/components/Iconify';
import Scrollbar from '@src/components/Scrollbar';
import { useAppDispatch } from '@src/hooks/useAppDispatch';
import { useAppSelector } from '@src/hooks/useAppSelector';
import { PATH_DASHBOARD } from '@src/routes/paths';
import {
  applyDiscount,
  decreaseQuantity,
  deleteCart,
  increaseQuantity,
  onNextStep,
} from '@src/store/product/product.slice';

import CheckoutProductList from './CheckoutProductList';
import CheckoutSummary from './CheckoutSummary';

export default function CheckoutCart() {
  const dispatch = useAppDispatch();

  const { checkout } = useAppSelector(state => state.product);

  const { cart, total, discount, subtotal } = checkout;

  const totalItems = sum(cart.map(item => item.quantity));

  const isEmptyCart = cart.length === 0;

  const handleDeleteCart = (productId: number) => {
    dispatch(deleteCart(productId));
  };

  const handleNextStep = () => {
    dispatch(onNextStep());
  };

  const handleIncreaseQuantity = (productId: number) => {
    dispatch(increaseQuantity(productId));
  };

  const handleDecreaseQuantity = (productId: number) => {
    dispatch(decreaseQuantity(productId));
  };

  const handleApplyDiscount = (value: number) => {
    dispatch(applyDiscount(value));
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Typography variant="h6">
                Card
                <Typography component="span" sx={{ color: 'text.secondary' }}>
                  &nbsp;({totalItems} item)
                </Typography>
              </Typography>
            }
            sx={{ mb: 3 }}
          />

          {!isEmptyCart ? (
            <Scrollbar>
              <CheckoutProductList
                products={cart}
                onDelete={handleDeleteCart}
                onIncreaseQuantity={handleIncreaseQuantity}
                onDecreaseQuantity={handleDecreaseQuantity}
              />
            </Scrollbar>
          ) : (
            <EmptyContent
              title="Cart is empty"
              description="Look like you have no items in your shopping cart."
              img="https://minimal-assets-api.vercel.app/assets/illustrations/illustration_empty_cart.svg"
            />
          )}
        </Card>

        <Button
          color="inherit"
          component={RouterLink}
          to={PATH_DASHBOARD.eCommerce.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
          Continue Shopping
        </Button>
      </Grid>

      <Grid item xs={12} md={4}>
        <CheckoutSummary
          enableDiscount
          total={total}
          discount={discount}
          subtotal={subtotal}
          onApplyDiscount={handleApplyDiscount}
        />
        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          disabled={cart.length === 0}
          onClick={handleNextStep}
        >
          Check Out
        </Button>
      </Grid>
    </Grid>
  );
}
