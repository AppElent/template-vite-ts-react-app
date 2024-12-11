import Belt from '@/libs/satisfactory/data/belt';
import { Box, Card, CardContent, CardMedia, Chip, Typography } from '@mui/material';

interface ItemCardProps {
  item: Belt;
}

const BeltCard: React.FC<ItemCardProps> = ({ item }) => {
  // const maxItemsToShow = 3;
  // const usedForItems = product.getUsedFor();
  // const itemsToShow = usedForItems.slice(0, maxItemsToShow);
  // const hasMoreItems = usedForItems.length > maxItemsToShow;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        //height="200"
        sx={{ aspectRatio: '1 / 1', backgroundColor: '#d0d0d0' }}
        image={item.getImage()}
        alt={item.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
        >
          {item.name}
        </Typography>
        <Chip
          label={`${item.rate} / min`}
          size="small"
          color="primary"
          sx={{ mb: 1 }}
        />
        <Box>{/* <RecipeOneliner recipe={{}} /> */}</Box>
      </CardContent>
    </Card>
  );
};

export default BeltCard;
