import {
  Card,
  CardHeader,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';

import { _ecommerceSalesOverview } from '@src/_mock';
import { fCurrency, fPercent } from '@src/utils/formatNumber';

interface ProgressItemProps {
  progress: {
    amount: number;
    label: string;
    value: number;
  };
}

function ProgressItem({ progress }: ProgressItemProps) {
  return (
    <Stack spacing={1}>
      <Stack direction="row" alignItems="center">
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          {progress.label}
        </Typography>
        <Typography variant="subtitle2">
          {fCurrency(progress.amount)}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          &nbsp;({fPercent(progress.value)})
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={progress.value}
        color={
          (progress.label === 'Total Income' && 'info') ||
          (progress.label === 'Total Expenses' && 'warning') ||
          'primary'
        }
      />
    </Stack>
  );
}

export default function EcommerceSalesOverview() {
  return (
    <Card>
      <CardHeader title="Sales Overview" />
      <Stack spacing={4} sx={{ p: 3 }}>
        {_ecommerceSalesOverview.map(progress => (
          <ProgressItem key={progress.label} progress={progress} />
        ))}
      </Stack>
    </Card>
  );
}
