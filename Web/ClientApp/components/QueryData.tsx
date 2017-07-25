import * as React from "react";
import "isomorphic-fetch";
import { Link } from "react-router";
import axios from "axios";
import shortid from "shortid";


export class QueryData extends React.Component<any, CurrentQueryState> {
  constructor() {
    super();
    this.state = { queries: [], sessions: [], loading: true };

    this.refreshCurrentlyExecutingQueries();
    this.refreshWhoData();
  }

  public render() {
    var self = this;
    return (
      <div>
        <h1>Currently running queries</h1>
        <button
          type="button"
          className="btn btn-primary az-margin-bottom"
          onClick={() => {
            self.refreshCurrentlyExecutingQueries();
          }}
        >
          Refresh
        </button>
        <table className="table table-striped table-bordered table-hover">
          <thead className="thead-inverse">
            <tr>
              <th>SPID</th>
              <th>Status</th>
              <th>Command</th>
              <th>Cpu Time (ms)</th>
              <th>Total Elapsed Time (ms)</th>
              <th>Text</th>
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            {this.state.queries.map(q =>
              <tr key={shortid.generate()}>
                <td><strong>{q.spid}</strong></td>
                <td>{q.status}</td>
                <td>{q.command}</td>
                <td>{q.cpuTime}</td>
                <td>{q.totalElapsedTime}</td>
                <td>{q.text.substr(0, 100)}</td>
                <td className="text-center">
                  <Link to={"/queries/detail/" + q.spid} target="_blank">
                    <span
                      role="button"
                      className="glyphicon glyphicon-modal-window"
                      data-toggle="tooltip"
                      title="View query info"
                    />
                  </Link>
                </td>
                <td className="text-center">
                  <span
                    role="button"
                    onClick={() => {
                      self.killQuery(q.spid, "PINAL_DAVE");
                    }}
                    className="glyphicon glyphicon-off text-danger"
                    data-toggle="tooltip"
                    title="Kill it"
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <h1>Currently established sessions (sp_who2)</h1>
        <button
          type="button"
          className="btn btn-primary az-margin-bottom"
          onClick={() => {
            self.refreshWhoData();
          }}
        >
          Refresh
        </button>
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th>SPID</th>
                <th>Status</th>
                <th>Login</th>
                <th>HostName</th>
                <th>BlockedBy</th>
                <th>DBName</th>
                <th>Command</th>
                <th>Cpu Time (ms)</th>
                <th>DiskIO</th>
                <th>LastBatch</th>
                <th>ProgramName</th>
                <th />
                <th />
              </tr>
            </thead>
            <tbody>
              {this.state.sessions.map(q =>
                <tr key={shortid.generate()}>
                  <td><strong>{q.spid}</strong></td>
                  <td>{q.status}</td>
                  <td>{q.login}</td>
                  <td>{q.hostName}</td>
                  <td>{q.blkBy}</td>
                  <td>{q.dbName}</td>
                  <td>{q.command}</td>
                  <td>{q.cpuTime}</td>
                  <td>{q.diskIO}</td>
                  <td>{q.lastBatch}</td>
                  <td>{q.programName}</td>
                  <td className="text-center">
                    <Link to={"/queries/detail/" + q.spid} target="_blank">
                      <span
                        role="button"
                        className="glyphicon glyphicon-modal-window"
                        data-toggle="tooltip"
                        title="Visualizza info query"
                      />
                    </Link>
                  </td>
                  <td className="text-center">
                    <span
                      role="button"
                      onClick={() => {
                        self.killQuery(q.spid, "WHO");
                      }}
                      className="glyphicon glyphicon-off text-danger"
                      data-toggle="tooltip"
                      title="Kill it"
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  refreshCurrentlyExecutingQueries = function() {
    axios
      .get("/api/query/currentqueries")
      .then(response => response.data as Promise<CurrentQuery[]>)
      .then(data => {
        this.setState({
          queries: data
        });
      });
  };

  refreshWhoData = function() {
    axios
      .get("/api/query/whoqueries")
      .then(response => response.data as Promise<SessionRow[]>)
      .then(data => {
        this.setState({
          sessions: data
        });
      });
  };

  killQuery = function(id, CALL) {
    axios
      .post("/api/query/killquery?queryId=" + id)
      .then(response => response.data as string)
      .then(data => {
        console.log(data);
        if (data) {
          alert(data);
        } else {
          switch (CALL) {
            case "PINAL_DAVE":
              this.refreshCurrentlyExecutingQueries();
              break;
            case "WHO":
              this.refreshWhoData();
              break;
            default:
              console.log("Call type non supported.");
              break;
          }
        }
      });
  };
}