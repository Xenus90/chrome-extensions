import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import 'fontsource-roboto';
import './popup.css';
import { Box, InputBase, IconButton, Paper, Grid } from '@material-ui/core';
import { Add as AddIcon, Message, PictureInPicture as PictureInPictureIcon } from '@material-ui/icons';
import { WeatherCard } from '../components/weatherCard/weatherCard';
import { setStoredCities, getStoredCities, LocalStorageOptions, getStoredOptions, setStoredOptions } from '../utils/storage';
import { Messages } from '../utils/messages';

const App = () => {
  const [cities, setCities] = useState<string[]>([]);
  const [cityInput, setCityInput] = useState<string>('');
  const [options, setOptions] = useState<LocalStorageOptions | null>(null);

  const handleCityButtonClick = async () => {
    if (cityInput !== '') {
      const updatedCities = [...cities, cityInput];
      await setStoredCities(updatedCities);
      setCities(updatedCities);
      setCityInput('');
    }
  };

  const handleCityDelete = async (cityIndex: number) => {
    cities.splice(cityIndex, 1);
    const updatedCities = [...cities];
    await setStoredCities(updatedCities);
    setCities(updatedCities);
  };

  const handleTempScaleButtonClick = async () => {
    const updatedOptions: LocalStorageOptions = {
      ...options,
      tempScale: options.tempScale === 'metric' ? 'imperial' : 'metric',
    };
    await setStoredOptions(updatedOptions);
    setOptions(updatedOptions);
  };

  const handleOverlayButtonClick = () => {
    chrome.tabs.query({ active: true }, tabs => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, Messages.TOGGLE_OVERLAY);
      }
    });
  };

  useEffect(() => {
    getStoredCities().then(cities => setCities(cities));
    getStoredOptions().then(options => setOptions(options));
  }, []);

  if (!options) return null;

  return (
    <>
      <Box mx={1} my={2}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Paper style={{ height: '48px' }}>
              <Box px={2} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <InputBase
                  placeholder="Add a city"
                  value={cityInput}
                  onChange={event => setCityInput(event.target.value)}
                />
                <IconButton onClick={handleCityButtonClick}>
                  <AddIcon />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={2}>
            <Paper style={{ height: '48px' }}>
              <IconButton onClick={handleTempScaleButtonClick}>
                {options.tempScale === 'metric' ? '\u2103' : '\u2109'}
              </IconButton>
            </Paper>
          </Grid>
          <Grid item xs={2}>
            <Paper style={{ height: '48px' }}>
              <IconButton onClick={handleOverlayButtonClick}>
                <PictureInPictureIcon />
              </IconButton>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      {options.homeCity !== '' && (
        <WeatherCard city={options.homeCity} tempScale={options.tempScale} />
      )}
      {cities.map((city, index) => (
        <WeatherCard
          key={index}
          city={city}
          tempScale={options.tempScale}
          onDelete={() => handleCityDelete(index)}
        />
      ))}
      <Box height="16px" />
    </>
  )
}

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(<App />, root);
