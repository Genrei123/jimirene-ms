import { Card, CardMedia, CardContent, CardActions, Button, Typography } from '@mui/material';

import exampleImage from '../../assets/assetsLogin.png';

import './MediaCard.css';


export default function MediaCard() {
  return (
    <div className="flex h-screen">
      
      <div className="flex-1 card-container p-6"> {/* Adjust the layout */}
        <Card sx={{ maxWidth: 345 }} className="media-card">
          <CardMedia
            sx={{ height: 140 }}
            image={exampleImage} // Use the imported image
            title="Login Image"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Welcome
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              This is a card that displays your custom image and description. Replace the text as needed.
            </Typography>
          </CardContent>
          <CardActions>
          <Button
  className="media-card-button"
  size="small"
  sx={{
    backgroundColor: '#cc0a92',
    color: 'white',
    padding: '8px 16px',
    fontSize: '14px',
    borderRadius: '4px',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#ac1e73',
      cursor: 'pointer',
    },
  }}
>
  View details
</Button>

</CardActions>
        </Card>
      </div>
    </div>
  );
}
