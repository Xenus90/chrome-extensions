import React, { useEffect, useState } from 'react';
import './weatherCard.css';
import { Box, Button, Card, CardActions, CardContent, Grid, Typography } from '@material-ui/core';
import { fetchWeatherData, fetchWeatherIcon } from '../../utils/api';
import { Weather, WeatherTempScale } from '../../utils/api.types';

type WeatherCardContainerProps = {
  children: React.ReactNode;
  onDelete?: () => void;
};

export const WeatherCardContainer = (props: WeatherCardContainerProps) => {
  const { children, onDelete } = props;

  return (
    <Box mx={1} my={2}>
      <Card>
        <CardContent>
          {children}
        </CardContent>
        {onDelete && (
          <CardActions>
            <Button color="secondary" onClick={onDelete}>
              <Typography className="weatherCard-body">
                Delete
              </Typography>
            </Button>
          </CardActions>
        )}
      </Card>
    </Box>
  );
};

type WeatherCardState = "loading" | "error" | "ready";

type WeatherCardProps = {
  city: string;
  tempScale: WeatherTempScale,
  onDelete?: () => void;
};

export const WeatherCard = (props: WeatherCardProps) => {
  const { city, tempScale, onDelete } = props;
  const [weatherData, setWeatherData] = useState<Weather | null>(null);
  const [cardState, setCardState] = useState<WeatherCardState>("loading");

  useEffect(() => {
    fetchWeatherData(city, tempScale).then(data => {
      setWeatherData(data);
      setCardState("ready");
    }).catch(() => {
      setCardState("error");
    });
  }, [city, tempScale]);

  if (cardState === "error" || cardState === "loading") {
    return (
      <WeatherCardContainer onDelete={onDelete}>
        <Typography className="weatherCard-title">{city}</Typography>
        <Typography className="weatherCard-body">
          {cardState === "loading" ? "Loading..." : "Error: could not retrieve city by name"}
        </Typography>
      </WeatherCardContainer>
    );
  }

  return (
    <WeatherCardContainer onDelete={onDelete}>
      <Grid container justify="space-around" alignItems="center">
        <Grid item>
          <Typography className="weatherCard-title">{weatherData.name}</Typography>
          <Typography className="weatherCard-body">{Math.round(weatherData.main.temp)}</Typography>
          <Typography className="weatherCard-body">Feels like: {Math.round(weatherData.main.feels_like)}</Typography>
        </Grid>
        <Grid item>
          {weatherData.weather.length > 0 && (
            <>
              <img src={fetchWeatherIcon(weatherData.weather[0].icon)} alt="weather icon" />
              <Typography className="weatherCard-body">
                {weatherData.weather[0].main}
              </Typography>
            </>
          )}
        </Grid>
      </Grid>
    </WeatherCardContainer>
  )
}
