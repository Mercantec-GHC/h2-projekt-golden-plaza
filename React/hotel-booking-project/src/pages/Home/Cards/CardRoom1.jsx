import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function MediaCard() {
    return (
        <Card sx={{ width: 395 }}>
            <CardMedia
                sx={{ height: 190 }}
                image="src/assets/lazlo-panaflex-HSClqx534aI-unsplash.jpg"
                title="Standard Room"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    Standard Room
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    This is a description of the standard room. It includes amenities and other details.
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Book</Button>
                <Button size="small">Details</Button>
            </CardActions>
        </Card>
    );
}
