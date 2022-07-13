import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { StyledEngineProvider } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';



class App extends Component
{
  state = { data: null,
    systemUptime: "System Uptime: Not Set",
    systemUptimeInstance: "System Uptime Instance: Not Set",
    localDateTime: "Local Date/Time: Not Set",
    tableData: []
  };

  componentDidMount()
  {
    this.callBackendAPI()
    .then(res => this.state({ data: res.express }))
    .catch(err => console.log(err));

    this.timer = setInterval(() => {
      this.getDataFromServer();
    }, 5000);
  }

  componentWillUnmount()
  {
    clearInterval(this.timer);
  }

  callBackendAPI = async () => {
    const response = await fetch('/express_backend');
    const body = await response.json();

    if (response.status !== 200)
    {
      throw Error(body.message);
    }

    return body;
  }

  getDataFromServer = async () => {
    const response = await fetch('/ServerData');
    const body = await response.json();

    if (response.status !== 200)
    {
      throw Error(body.message);
    }

    body.tableData.forEach(item => {
      let temp = item.id;
      item.id = item._id;
      item._id = temp;
    })

    this.state.systemUptime = body.systemUptime;
    this.state.systemUptimeInstance = body.systemUptimeInstance;
    this.state.localDateTime = body.localDateTime;
    this.state.tableData = body.tableData;
    this.setState({ state: this.state });

    return body;
  }

  render ()
  {
    return (
      <div className="App">
        <p className="App-intro">{this.state.data}</p>
        <p className="System Uptime">{this.state.systemUptime}</p>
        <p className="System Uptime Instance">{this.state.systemUptimeInstance}</p>
        <p className="Local Date/Time">{this.state.localDateTime}</p>
        {this.BasicTable()}
      </div>
    );
  }

  BasicTable()
  {
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="right">System Uptime (secs)</TableCell>
              <TableCell align="right">System Uptime Instance&nbsp;(secs)</TableCell>
              <TableCell align="right">Local Date/Time</TableCell>
              <TableCell align="right">RAM Used&nbsp;(%)</TableCell>
              <TableCell align="right">CPU Usage&nbsp;(%)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.tableData.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="right">{row.SystemUptime}</TableCell>
                <TableCell align="right">{row.SystemUptimeInstance}</TableCell>
                <TableCell align="right">{row.LocalDateTime}</TableCell>
                <TableCell align="right">{row.RAMUsed}</TableCell>
                <TableCell align="right">{row.CPUUsage}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}



export default App;
