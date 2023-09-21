import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { denormalize } from './predictions';
const UpcomingWeek = ({ schedule, maxScore }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell align='right'>Home team</TableCell>
            <TableCell align='right'>Home score</TableCell>
            <TableCell align='left'>Away score</TableCell>
            <TableCell align='left'>Away team</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {schedule.length > 0 &&
            schedule.map((match) => (
              <TableRow
                key={match.homeTeam + match.awayTeam}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align='right'>{match.homeTeam}</TableCell>
                <TableCell align='right'>
                  {denormalize(match.score.homeScore, maxScore)}
                </TableCell>
                <TableCell align='left'>
                  {denormalize(match.score.awayScore, maxScore)}
                </TableCell>
                <TableCell align='left'>{match.awayTeam}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UpcomingWeek;
