import { Link as RouterLink } from 'react-router-dom';

import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Link,
  Stack,
  Typography,
} from '@mui/material';

import { _analyticPost } from '@src/_mock';
import Iconify from '@src/components/Iconify';
import Image from '@src/components/Image';
import Scrollbar from '@src/components/Scrollbar';
import { fToNow } from '@src/utils/formatTime.util';

interface NewsItemProps {
  news: {
    description: string;
    image: string;
    postedAt: Date;
    title: string;
  };
}

function NewsItem({ news }: NewsItemProps) {
  const { image, title, description, postedAt } = news;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Image
        alt={title}
        src={image}
        sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }}
      />
      <Box sx={{ minWidth: 240 }}>
        <Link component={RouterLink} to="#" color="inherit">
          <Typography variant="subtitle2" noWrap>
            {title}
          </Typography>
        </Link>
        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {description}
        </Typography>
      </Box>
      <Typography
        variant="caption"
        sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}
      >
        {fToNow(postedAt)}
      </Typography>
    </Stack>
  );
}

export default function AnalyticsNewsUpdate() {
  return (
    <Card>
      <CardHeader title="News Update" />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {_analyticPost.map(news => (
            <NewsItem key={news.id} news={news} />
          ))}
        </Stack>
      </Scrollbar>

      <Divider />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          to="#"
          size="small"
          color="inherit"
          component={RouterLink}
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
        >
          View all
        </Button>
      </Box>
    </Card>
  );
}
