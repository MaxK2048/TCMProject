import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component
{
  state = { data: null,
    systemUptime: "System Uptime: Not Set",
    systemUptimeInstance: "System Uptime Instance: Not Set",
    localDateTime: "Local Date/Time: Not Set"
  };

  componentDidMount()
  {
    this.callBackendAPI()
    .then(res => this.state({ data: res.express }))
    .catch(err => console.log(err));

    this.timer = setInterval(() => {
      this.getDataFromServer();
    }, 1000);
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

    this.state.systemUptime = body.systemUptime;
    this.state.systemUptimeInstance = body.systemUptimeInstance;
    this.state.localDateTime = body.localDateTime;
    //console.log(this.state.sysUptime);
    this.setState({ state: this.state });

    return body;
  }

  render ()
  {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">{this.state.data}</p>
        <p className="System Uptime">{this.state.systemUptime}</p>
        <p className="System Uptime Instance">{this.state.systemUptimeInstance}</p>
        <p className="Local Date/Time">{this.state.localDateTime}</p>
      </div>
    );
  }
}

export default App;
