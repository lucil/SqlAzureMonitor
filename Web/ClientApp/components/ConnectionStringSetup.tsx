import * as React from "react";
import axios from 'axios';

export class ConnectionStringSetup extends React.Component<any, any> {

  constructor() {
    super();
    this.state = { connectionString: "", connectionError: false, errorType: 0 };

    this.handleChange = this.handleChange.bind(this);
    this.getServerIpAddress();
  }

  handleChange(event) {
    this.setState({ connectionString: event.target.value });
  }

  public render() {
    return (
      <div className="container">
        <div className="row row-centered">
          <div className="col-xs-12 col-centered">
            <div className="item">
              <div className="content text-center vcenter">
                <h2 className="text-center">Sql azure monitor</h2>
                <div role="form">
                  <div className="form-group">
                    <label htmlFor="connstring">Connection string</label>
                    <input type="text" className="form-control" id="connstring" value={this.state.connectionString} onChange={this.handleChange}
                      placeholder="Server=tcp:[serverName].database.windows.net;Database=myDataBase;User ID=[LoginForDb]@[serverName];Password=myPassword;Trusted_Connection=False;Encrypt=True;" />
                  </div>
                  <button type="submit"
                    className="btn btn-success"
                    onClick={() => {
                      this.submitConnectionString();
                    }}
                  >Start monitoring</button>
                </div>
                <div className="bs-callout bs-callout-primary text-left">
                  <span> Please make sure you authorize application public ip <strong>{this.state.ip}</strong> in your Sql Azure instance firewall.</span> Check
                    <a href="https://docs.microsoft.com/en-us/azure/sql-database/sql-database-firewall-configure" target="_blank"> Sql Azure firewall docs</a> for more information.
                  </div>

                {this.state.connectionError ?
                  <div className="bs-callout bs-callout-danger text-left">
                    <h4>Failed to connect to database</h4>
                    {this.state.errorType == 3 ? 
                      <div>The connection string you entered is not a valid Sql Azure connection string.</div> : null
                    }
                    <span>Plaese verify that the connection string is correct.</span><br />
                    <span> Please make sure you have added authorize application public ip <strong>{this.state.ip}</strong> in your Sql Azure instance firewall.</span> Check
                    <a href="https://docs.microsoft.com/en-us/azure/sql-database/sql-database-firewall-configure" target="_blank"> Sql Azure firewall docs</a> for more information.
                    
                  </div> : null
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  submitConnectionString = function () {
    var self = this;
    var connectionstring = JSON.stringify({
      value: this.state.connectionString
    })
    axios.post('/api/connectionstring/check', connectionstring, {
      headers: {
        "Content-Type": "application/json"
      }
    }).then(function (response) {
      var checkResult = response.data;
      switch (checkResult) {
        case 1:

          axios.post('/api/connectionstring/add', connectionstring, {
            headers: {
              "Content-Type": "application/json"
            }
          });

          window.location.assign('/realtime');
          break;
        case 2:
          self.setState({ connectionError: true, errorType: 2 });
          break;
        case 3:
          self.setState({ connectionError: true, errorType: 3 });
          break;
        default:
          throw "Unknown connection string check result.";
      }
    })
  };

  getServerIpAddress = function () {
    var self = this;
    axios
      .get("/api/connectionstring/ip")
      .then(function (response) {
        self.setState({ ip: response.data })
      });
  }
}