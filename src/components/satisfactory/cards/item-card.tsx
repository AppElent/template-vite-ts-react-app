import BaseItem from '@/libs/satisfactory/data/base-item';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

interface ItemCardProps {
  item: BaseItem;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
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
      </CardContent>
    </Card>
  );
};

export default ItemCard;
