import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './contentScript.css';
import 'fontsource-roboto';
import { Card } from '@material-ui/core';
import { WeatherCard } from '../components/weatherCard/weatherCard';
import { getStoredOptions, LocalStorageOptions } from '../utils/storage';
import { Messages } from '../utils/messages';

const App = () => {
  const [options, setOptions] = useState<LocalStorageOptions | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    getStoredOptions().then(options => {
      setOptions(options);
      setIsActive(options.hasAutoOverlay);
    });
  }, []);

  useEffect(() => {
    chrome.runtime.onMessage.addListener(message => {
      if (message === Messages.TOGGLE_OVERLAY) {
        setIsActive(prevState => !prevState);
      }
    });
  }, [isActive]);

  if (!options) return null;

  return isActive && (
    <Card className="overlayCard">
      <WeatherCard
        city={options.homeCity}
        tempScale={options.tempScale}
        onDelete={() => setIsActive(false)}
      />
    </Card>
  );
};

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(<App />, root);