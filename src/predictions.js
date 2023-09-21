/* global brain */
import { scores, matchup } from './fixtures';
function normalize(value, max) {
  return value / max;
}

export const denormalize = (value, max) => {
  return Math.round(value * max);
};

export const getMaxValue = () => {
  return Math.max(
    ...scores.map(({ homeScore }) => homeScore),
    ...scores.map(({ awayScore }) => awayScore)
  );
};

export const teamsArr = [
  'Teva',
  'IBM',
  'Sterling',
  'PKO',
  'Primost',
  'Avenade',
  'FedEx',
  'Corgi.pro',
  'Arrow',
];

export const getTeamById = (id) => {
  if (id === 0.1) {
    return 'Teva';
  }
  if (id === 0.2) {
    return 'IBM';
  }
  if (id === 0.3) {
    return 'Sterling';
  }
  if (id === 0.4) {
    return 'PKO';
  }
  if (id === 0.5) {
    return 'Primost';
  }
  if (id === 0.6) {
    return 'Avenade';
  }
  if (id === 0.7) {
    return 'FedEx';
  }
  if (id === 0.8) {
    return 'Corgi.pro';
  }
  if (id === 0.9) {
    return 'Arrow';
  }
};

const getTeamId = (team) => {
  if (team === 'Teva') {
    return 0.1;
  }
  if (team === 'IBM') {
    return 0.2;
  }
  if (team === 'Sterling') {
    return 0.3;
  }
  if (team === 'PKO') {
    return 0.4;
  }
  if (team === 'Primost') {
    return 0.5;
  }
  if (team === 'Avenade') {
    return 0.6;
  }
  if (team === 'FedEx') {
    return 0.7;
  }
  if (team === 'Corgi.pro') {
    return 0.8;
  }
  if (team === 'Arrow') {
    return 0.9;
  }
};

export const parseHistoricalData = () => {
  const elements = Array.from(document.querySelectorAll('.event'));
  return elements.reduce(
    (acc, current) => {
      const homeTeam = current.querySelector('.team-1').innerText.split(' ')[0];
      const awayTeam = current.querySelector('.team-2').innerText.split(' ')[0];
      const [homeScore, awayScore] = current
        .querySelector('.time')
        .innerText.split(':');
      return {
        matchup: [
          ...acc.matchup,
          {
            homeTeam,
            awayTeam,
          },
        ],
        scores: [
          ...acc.scores,
          { homeScore: Number(homeScore), awayScore: Number(awayScore) },
        ],
      };
    },
    { matchup: [], scores: [] }
  );
};
// const matchup = [
//   { homeTeam: 'Teva', awayTeam: 'IBM' },
//   { homeTeam: 'Sterling', awayTeam: 'PKO' },
//   { homeTeam: 'Primost', awayTeam: 'Avenade' },
//   { homeTeam: 'Fedex', awayTeam: 'Arrow' },
//   { homeTeam: 'Corgi', awayTeam: 'Primost' },
//   { homeTeam: 'Avenade', awayTeam: 'Teva' },
//   { homeTeam: 'Sterling', awayTeam: 'Arrow' },
//   { homeTeam: 'IBM', awayTeam: 'PKO' },
// ];

// const scores = [
//   { homeScore: 5, awayScore: 4 },
//   { homeScore: 7, awayScore: 3 },
//   { homeScore: 7, awayScore: 3 },
//   { homeScore: 3, awayScore: 1 },
//   { homeScore: 2, awayScore: 2 },
//   { homeScore: 2, awayScore: 2 },
//   { homeScore: 10, awayScore: 1 },
//   { homeScore: 6, awayScore: 0 },
// ];

const net = new brain.NeuralNetwork({ hiddenLayers: [4] });

const trainingData = [];

export const train = () => {
  return new Promise((resolve, reject) => {
    try {
      const maxValue = getMaxValue(scores);
      for (let i = 0; i < matchup.length; i++) {
        trainingData.push({
          input: {
            homeTeam: getTeamId(matchup[i].homeTeam),
            awayTeam: getTeamId(matchup[i].awayTeam),
          },
          output: {
            homeScore: normalize(scores[i].homeScore, maxValue),
            awayScore: normalize(scores[i].awayScore, maxValue),
          },
        });
      }
      net.train(trainingData);
      resolve();
    } catch {
      reject('Something went wrong');
    }
  });
};

export const runIt = (homeTeam, awayTeam) => {
  const output = net.run({
    homeTeam: getTeamId(homeTeam),
    awayTeam: getTeamId(awayTeam),
  });
  return output;
};
