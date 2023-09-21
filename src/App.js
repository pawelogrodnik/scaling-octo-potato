import './App.css';
import {
  runIt,
  train,
  teamsArr,
  getMaxValue,
  denormalize,
} from './predictions';
import { useEffect, useState } from 'react';
import { upcomingWeekMatches } from './fixtures';
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
import UpcomingWeek from './UpcomingWeek';

const App = () => {
  const maxScore = getMaxValue();
  const [currentPrediction, setPrediction] = useState([]);
  const [latestPrediction, setLatestPrediction] = useState();
  const [schedule, setSchedulePredictedScore] = useState([]);
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
  useEffect(() => {
    const result = upcomingWeekMatches.map((match) => ({
      ...match,
      score: nostradamus(match.homeTeam, match.awayTeam),
    }));
    setSchedulePredictedScore(result);
  }, []);
  const nostradamus = (homeTeam, awayTeam) => runIt(homeTeam, awayTeam);

  const predictScore = () => {
    const score = nostradamus(input.homeTeam, input.awayTeam);
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
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <UpcomingWeek schedule={schedule} maxScore={maxScore} />
      </div>

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
            {currentPrediction.map((prediction, index) => (
              <Typography key={`${index}-${prediction}`}>
                {prediction}
              </Typography>
            ))}
            <Typography>{JSON.stringify(latestPrediction)}</Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};

export default App;

// const upcomingWeekMatches = [
//   {
//     homeTeam: 'IBM',
//     awayTeam: 'Arrow',
//   },
//   {
//     homeTeam: 'Primost',
//     awayTeam: 'Sterling',
//   },
//   {
//     homeTeam: 'FedEx',
//     awayTeam: 'Teva',
//   },
//   {
//     homeTeam: 'Corgi.pro',
//     awayTeam: 'Avenade',
//   },
// ];

// const UpcomingWeek = ({ nostradamus }) => {
//   const [schedule, setSchedulePredictedScore] = useState([]);
//   useEffect(() => {
//     const result = upcomingWeekMatches.map((match) => ({
//       ...match,
//       score: nostradamus(match.homeTeam, match.awayTeam),
//     }));
//     setSchedulePredictedScore(result);
//   }, [nostradamus]);
//   return (
//     <TableContainer component={Paper}>
//       <Table sx={{ minWidth: 650 }} aria-label='simple table'>
//         <TableHead>
//           <TableRow>
//             <TableCell align='right'>Home team</TableCell>
//             <TableCell align='right'>Home score&nbsp;(g)</TableCell>
//             <TableCell align='right'>Away team</TableCell>
//             <TableCell align='right'>Away score</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {schedule.map((row) => (
//             <TableRow
//               key={row.name}
//               sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//             >
//               <TableCell align='right'>{row.calories}</TableCell>
//               <TableCell align='right'>{row.fat}</TableCell>
//               <TableCell align='right'>{row.carbs}</TableCell>
//               <TableCell align='right'>{row.protein}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };
