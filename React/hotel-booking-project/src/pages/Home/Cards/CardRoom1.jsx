import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function MediaCard({ title, description, image }) {
    return (
        <Card
            sx={{
                width: 395,
                backgroundColor: 'rgba(0, 0, 0, 0.85)', // Dark background
                color: 'rgb(180, 155, 99)' // Text color
            }}
        >
            <CardMedia
                sx={{ height: 190 }}
                image={image}
                title={title}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div" sx={{ color: 'rgb(180, 155, 99)' }}>
                    {title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgb(180, 155, 99)' }}>
                    {description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" sx={{ color: 'rgb(180, 155, 99)' }}>Book</Button>
                <Button size="small" sx={{ color: 'rgb(180, 155, 99)' }}>Details</Button>
            </CardActions>
        </Card>
    );
}
