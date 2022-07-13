import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export function createData(entry, systemUptime, systemUptimeInstance, localDateTime, ramUsed, cpuUsage)
{
  return { entry, systemUptime, systemUptimeInstance, localDateTime, ramUsed, cpuUsage };
}

//const rows = [
 export var rows = [
  createData('0', 159, 262, "DATE", 35, 15),
  createData('1', 237, 356, "DATE", 24, 35),
  createData('2', 262, 237, "DATE", 67, 8),
  createData('3', 305, 159, "DATE", 92, 70),
  createData('4', 356, 305, "DATE", 5, 89),
];

/* export function addData(entry, systemUptime, systemUptimeInstance, localDateTime, ramUsed, cpuUsage)
{
  rows.push(createData(entry, systemUptime, systemUptimeInstance, localDateTime, ramUsed, cpuUsage));
} */

//export default function BasicTable(entry, systemUptime, systemUptimeInstance, localDateTime, ramUsed, cpuUsage)
export default function BasicTable()
{
  //rows.push(createData(entry, systemUptime, systemUptimeInstance, localDateTime, ramUsed, cpuUsage));
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Entry</TableCell>
            <TableCell align="right">System Uptime (secs)</TableCell>
            <TableCell align="right">System Uptime Instance&nbsp;(secs)</TableCell>
            <TableCell align="right">Local Date/Time</TableCell>
            <TableCell align="right">RAM Used&nbsp;(%)</TableCell>
            <TableCell align="right">CPU Usage&nbsp;(%)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.entry}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.entry}
              </TableCell>
              <TableCell align="right">{row.systemUptime}</TableCell>
              <TableCell align="right">{row.systemUptimeInstance}</TableCell>
              <TableCell align="right">{row.localDateTime}</TableCell>
              <TableCell align="right">{row.ramUsed}</TableCell>
              <TableCell align="right">{row.cpuUsage}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
