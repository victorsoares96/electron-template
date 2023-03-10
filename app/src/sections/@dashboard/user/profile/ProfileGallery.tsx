import { useState } from 'react';

import { Box, Card, CardContent, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import PropTypes from 'prop-types';

import Iconify from '@src/components/Iconify';
import Image from '@src/components/Image';
import LightboxModal from '@src/components/LightboxModal';
import cssStyles from '@src/utils/cssStyles';
import { fDate } from '@src/utils/formatTime.util';

const CaptionStyle = styled(CardContent)(({ theme }) => ({
  ...cssStyles().bgBlur({ blur: 2, color: theme.palette.grey[900] }),
  bottom: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  justifyContent: 'space-between',
  color: theme.palette.common.white,
}));

interface ProfileGalleryProps {
  gallery: any[];
}

interface GalleryItemProps {
  image: {
    imageUrl: string;
    title: string;
    postAt: number | Date;
  };
  onOpenLightbox: (url: string) => void;
}

function GalleryItem({ image, onOpenLightbox }: GalleryItemProps) {
  const { imageUrl, title, postAt } = image;
  return (
    <Card sx={{ cursor: 'pointer', position: 'relative' }}>
      <Image
        alt="gallery image"
        ratio="1/1"
        src={imageUrl}
        onClick={() => onOpenLightbox(imageUrl)}
      />

      <CaptionStyle>
        <div>
          <Typography variant="subtitle1">{title}</Typography>
          <Typography variant="body2" sx={{ opacity: 0.72 }}>
            {fDate(postAt)}
          </Typography>
        </div>
        <IconButton color="inherit">
          <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
        </IconButton>
      </CaptionStyle>
    </Card>
  );
}

export default function ProfileGallery({ gallery }: ProfileGalleryProps) {
  const [openLightbox, setOpenLightbox] = useState(false);

  const [selectedImage, setSelectedImage] = useState(0);

  const imagesLightbox = gallery.map(img => img.imageUrl);

  const handleOpenLightbox = (url: string) => {
    const selectedImage = imagesLightbox.findIndex(index => index === url);
    setOpenLightbox(true);
    setSelectedImage(selectedImage);
  };
  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Gallery
      </Typography>

      <Card sx={{ p: 3 }}>
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
          {gallery.map(image => (
            <GalleryItem
              key={image.id}
              image={image}
              onOpenLightbox={handleOpenLightbox}
            />
          ))}
        </Box>

        <LightboxModal
          images={imagesLightbox}
          mainSrc={imagesLightbox[selectedImage]}
          photoIndex={selectedImage}
          setPhotoIndex={setSelectedImage}
          isOpen={openLightbox}
          onCloseRequest={() => setOpenLightbox(false)}
        />
      </Card>
    </Box>
  );
}
