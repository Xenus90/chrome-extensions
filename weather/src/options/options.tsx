import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import './options.css'
import 'fontsource-roboto';
import { Box, Button, Card, CardContent, Grid, Switch, TextField, Typography } from '@material-ui/core';
import { getStoredOptions, LocalStorageOptions, setStoredOptions } from '../utils/storage';

type FormState = 'saving' | 'ready';

const App: React.FC<{}> = () => {
  const [options, setOptions] = useState<LocalStorageOptions | null>(null);
  const [formState, setFormState] = useState<FormState>('ready');

  const handleHomeCityChange = (homeCity: string) => {
    setOptions({ ...options, homeCity });
  };

  const handleAutoOverlayChange = (hasAutoOverlay: boolean) => {
    setOptions({ ...options, hasAutoOverlay });
  };

  const handleSaveButtonClick = async () => {
    setFormState('saving');
    await setStoredOptions(options);
    setTimeout(() => {
      setFormState('ready');
    }, 1000);
  };

  useEffect(() => {
    getStoredOptions().then(options => setOptions(options));
  }, []);

  if (!options) return null;

  return (
    <Box mx={1} my={2}>
      <Card>
        <CardContent>
          <Grid container direction="column" spacing={4}>
            <Grid item>
              <Typography variant="h4">Weather extension options</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1">Home city name</Typography>
              <TextField
                value={options.homeCity}
                onChange={event => handleHomeCityChange(event.target.value)}
              />
            </Grid>
            <Grid item>
              <Typography variant="body1">Enable overlay on webpage</Typography>
              <Switch
                color="primary"
                value={options.hasAutoOverlay}
                onChange={(_event, checked) => handleAutoOverlayChange(checked)}
              />
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleSaveButtonClick}>
                {formState === 'ready' ? 'Save' : 'Saving...'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(<App />, root);
