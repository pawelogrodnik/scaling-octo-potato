import './App.css';
import {
  runIt,
  train,
  teamsArr,
  getMaxValue,
  denormalize,
} from './predictions';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const App = () => {
  const maxScore = getMaxValue();
  const [currentPrediction, setPrediction] = useState([]);
  const [latestPrediction, setLatestPrediction] = useState();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    homeTeam: teamsArr[0],
    awayTeam: teamsArr[1],
  });
  const trainModel = async () => {
    setLoading(true);
    await train();
    setLoading(false);
  };
  useEffect(() => {
    trainModel();
  }, []);

  const predictScore = () => {
    const score = runIt(input.homeTeam, input.awayTeam);
    setPrediction([
      ...currentPrediction,
      JSON.stringify({
        homeTeam: input.homeTeam,
        awayTeam: input.awayTeam,
        score,
      }),
      setLatestPrediction({
        homeTeam: input.homeTeam,
        awayTeam: input.awayTeam,
        homeScore: denormalize(score.homeScore, maxScore),
        awayScore: denormalize(score.awayScore, maxScore),
      }),
    ]);
  };

  return (
    <div className='App'>
      {loading && <h1>Trenuje...</h1>}
      <div style={{ maxWidth: 300, padding: 30, margin: '0 auto' }}>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id='homeTeam'>Home Team</InputLabel>
            <Select
              labelId='homeTeam'
              id='homeTeam'
              value={input.homeTeam}
              label='Age'
              onChange={({ target }) =>
                setInput({ homeTeam: target.value, awayTeam: input.awayTeam })
              }
              style={{ marginBottom: 30 }}
            >
              {teamsArr.map((team) => (
                <MenuItem key={`home-${team}`} value={team}>
                  {team}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id='awayTeam'>Away Team</InputLabel>
            <Select
              labelId='awayTeam'
              id='awayTeam'
              value={input.awayTeam}
              label='Age'
              onChange={({ target }) =>
                setInput({ homeTeam: input.homeTeam, awayTeam: target.value })
              }
            >
              {teamsArr.map((team) => (
                <MenuItem key={`home-${team}`} value={team}>
                  {team}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            style={{ marginTop: 20 }}
            onClick={predictScore}
            variant='contained'
            disabled={loading}
          >
            Predict score
          </Button>
        </Box>
      </div>
      {latestPrediction && (
        <div>
          <Typography variant='h1' component='h2'>
            {latestPrediction.homeTeam} {latestPrediction.homeScore}:
            {latestPrediction.awayScore} {latestPrediction.awayTeam}
          </Typography>
        </div>
      )}

      <div style={{ maxWidth: 800, padding: 30, margin: '0 auto' }}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'
          >
            <Typography>Logi</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div>
                {currentPrediction.map((prediction) => (
                  <p>{prediction}</p>
                ))}
              </div>
              <pre>{JSON.stringify(latestPrediction)}</pre>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};

export default App;
