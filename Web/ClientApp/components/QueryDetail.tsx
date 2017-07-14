import * as React from "react";
import "isomorphic-fetch";
import axios from "axios";
import FileSaver from "file-saver";

export class QueryDetail extends React.Component<any, Query> {
  constructor(props) {
    super(props);
    var initQuery: Query = {
      spid: props.params.queryId,
      hostName: "",
      programName: "",
      loginName: "",
      loginTime: new Date(),
      sqlScript: ""
    };

    this.setState(initQuery);
  }

  componentDidMount() {
    this.getQueryDetail(this.props.params.queryId);
  }

  public render() {
    var self = this;
    if (this.state && this.state.loginTime) {
      return (
        <div>
          <h1>Query {this.props.params.queryId}</h1>

          <div className="row">
            <div className="col-md-3">
              <ul className="list-group">
                <li className="list-group-item">SPID: {this.state.spid}</li>
                <li className="list-group-item">
                  ProgramName: {this.state.programName}
                </li>
                <li className="list-group-item">
                  HostName: {this.state.hostName}
                </li>
                <li className="list-group-item">
                  LoginName: {this.state.loginName}
                </li>
                <li className="list-group-item">
                  LoginTime (UTC): {this.state.loginTime}
                </li>
              </ul>
               <button
                type="button"
                className="btn btn-primary az-margin-top"
                onClick={() => {
                    self.downloadQueryInfo();
                }}
                >
                Download query information
                </button>
            </div>
            <div className="col-md-9">
              <code>
                {this.state.sqlScript.split("\n").map(i => {
                  return <div>{i}</div>;
                })}
              </code>
            </div>
          </div>

        </div>
      );
    } else {
      return (
        <div className="az-margin-top">
          <span>
            It seems I can't find any information about this query. Please try
            with another SPID.
          </span>
        </div>
      );
    }
  }

  getQueryDetail = function(spid) {
    axios
      .get("/api/query/detail?queryId=" + spid)
      .then(response => response.data as Promise<Query>)
      .then(data => {
        this.setState(data);
      });
  };

  downloadQueryInfo = function() {
    var spid = this.state.spid;
    var fileName = spid + ".json";
    var jsonState = JSON.stringify(this.state, null, 2);
    var file = new File([jsonState], fileName, {
      type: "application/json"
    });
    FileSaver.saveAs(file);
  };
}
