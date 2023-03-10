import { useRef } from 'react';
import Slider from 'react-slick';

import { Box, Button, Card, Container, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { m } from 'framer-motion';

import { _carouselsMembers } from '@src/_mock';
import Iconify from '@src/components/Iconify';
import Image from '@src/components/Image';
import SocialsButton from '@src/components/SocialsButton';
import { MotionViewport, varFade } from '@src/components/animate';
import { CarouselArrows } from '@src/components/carousel';

interface MemberCardProps {
  member: {
    avatar: string;
    name: string;
    role: string;
  };
}

function MemberCard({ member }: MemberCardProps) {
  const { name, role, avatar } = member;

  return (
    <Card key={name} sx={{ p: 1 }}>
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 0.5 }}>
        {name}
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        {role}
      </Typography>
      <Image alt={name} src={avatar} ratio="1/1" sx={{ borderRadius: 1.5 }} />
      <Stack alignItems="center" sx={{ mt: 2, mb: 1 }}>
        <SocialsButton sx={{ color: 'action.active' }} />
      </Stack>
    </Card>
  );
}

export default function AboutTeam() {
  const carouselRef = useRef<Slider>(null);

  const theme = useTheme();

  const settings = {
    arrows: false,
    slidesToShow: 4,
    centerMode: true,
    centerPadding: '0px',
    rtl: Boolean(theme.direction === 'rtl'),
    responsive: [
      {
        breakpoint: 1279,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 959,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const handlePrevious = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  return (
    <Container component={MotionViewport} sx={{ pb: 10, textAlign: 'center' }}>
      <m.div variants={varFade().inDown}>
        <Typography
          component="p"
          variant="overline"
          sx={{ mb: 2, color: 'text.secondary' }}
        >
          Dream team
        </Typography>
      </m.div>

      <m.div variants={varFade().inUp}>
        <Typography variant="h2" sx={{ mb: 3 }}>
          Great team is the key
        </Typography>
      </m.div>

      <m.div variants={varFade().inUp}>
        <Typography
          sx={{
            mx: 'auto',
            maxWidth: 630,
            color: theme =>
              theme.palette.mode === 'light'
                ? 'text.secondary'
                : 'common.white',
          }}
        >
          Minimal will provide you support if you have any problems, our support
          team will reply within a day and we also have detailed documentation.
        </Typography>
      </m.div>

      <Box sx={{ position: 'relative' }}>
        <CarouselArrows filled onNext={handleNext} onPrevious={handlePrevious}>
          <Slider ref={carouselRef} {...settings}>
            {_carouselsMembers.map(member => (
              <Box
                key={member.id}
                component={m.div}
                variants={varFade().in}
                sx={{ px: 1.5, py: 10 }}
              >
                <MemberCard member={member} />
              </Box>
            ))}
          </Slider>
        </CarouselArrows>
      </Box>
      <Button
        variant="outlined"
        color="inherit"
        size="large"
        endIcon={
          <Iconify icon="ic:round-arrow-right-alt" width={24} height={24} />
        }
        sx={{ mx: 'auto' }}
      >
        View all team members
      </Button>
    </Container>
  );
}
