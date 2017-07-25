import * as React from "react";
import "isomorphic-fetch";
import axios from "axios";
import shortid from "shortid";
import Select from "react-select";
import "react-select/dist/react-select.css";

export class PerformanceData extends React.Component<
  any,
  PerformanceDataState> {
  orderByFieldArray = [
    { value: "EXECUTION_COUNT", label: "Execution count" },
    { value: "TOTAL_WORKER_TIME", label: "Total worker time" },
    { value: "AVERAGE_CPU_TIME", label: "Average cpu time" },
    { value: "TOTAL_READS", label: "Total reads" },
    { value: "TOTAL_WRITES", label: "Total writes" }
  ];

  orderBySortArray = [
    { value: "ASC", label: "Ascending" },
    { value: "DESC", label: "Descending" }
  ];

  numberOfQueriesArray = [
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 50, label: "50" }
  ];

  constructor() {
    super();

    const initialState = {
      queries: [
        {
          executionCount: 0,
          totalWorkerTime: 0,
          averageCpuTime: 0,
          totalReads: 0,
          totalWrites: 0,
          sqlScript: "",
          sqlExtract: ""
        }
      ],
      numberOfQueries: 10,
      orderByField: "AVERAGE_CPU_TIME",
      orderBySort: "DESC",
      loading: true
    };

    this.state = initialState;
    
  }

  componentDidMount() {
    var initialState = this.state;
    this.getPerformanceData(
      initialState.numberOfQueries,
      initialState.orderByField,
      initialState.orderBySort
    );
  }

  getPerformanceData = function(numberOfQueries, orderByField, orderBySort) {
    this.setState({
      queries: [],
      numberOfQueries: numberOfQueries,
      orderByField: orderByField,
      orderBySort: orderBySort
    });

    axios
      .get(
        "/api/performance/queries?numberOfQueries=" +
          numberOfQueries +
          "&orderByField=" +
          orderByField +
          "&orderBySort=" +
          orderBySort
      )
      .then(response => response.data as Promise<PerformanceQuery[]>)
      .then(data => {
        this.setState({
          queries: data,
          numberOfQueries: numberOfQueries,
          orderByField: orderByField,
          orderBySort: orderBySort
        });
      });
  };

  orderByFieldSelected = function(self, filterItem) {
    self.setState({
      orderByField: filterItem.value
    });
  };

  numberOfQueriesSelected = function(self, filterItem) {
    self.setState({
      numberOfQueries: filterItem.value
    });
  };

  orderBySortSelected = function(self, filterItem) {
    self.setState({
      orderBySort: filterItem.value
    });
  };

  public render() {
    var self = this;
    const renderTable = this.state.queries && this.state.queries.length > 0;
    let table;
    if (renderTable) {
      table = (
        <table className="table table-striped table-bordered table-hover az-margin-top">
          <thead className="thead-inverse">
            <tr>
              <th>Execution count</th>
              <th>Total worker time</th>
              <th>Average cpu time</th>
              <th>Total reads</th>
              <th>Total writes</th>
              <th>Sql extract</th>
            </tr>
          </thead>
          <tbody>
            {this.state.queries.map(q =>
              <tr key={shortid.generate()}>
                <td>{q.executionCount}</td>
                <td>{q.totalWorkerTime}</td>
                <td>{q.averageCpuTime}</td>
                <td>{q.totalReads}</td>
                <td>{q.totalWrites}</td>
                <td>{q.sqlExtract}</td>
              </tr>
            )}
          </tbody>
        </table>
      );
    } else {
      table = (
        <div className="az-margin-top">
          <span>
            Loading ...
          </span>
        </div>
      );
    }

    return (
      <div>
        <h1>Performance Data</h1>
        <div className="row">
          <div className="col-md-3">
            <label>Number of elements</label>
            <Select
              name="numberOfQueries"
              value={this.state.numberOfQueries}
              options={this.numberOfQueriesArray}
              onChange={self.numberOfQueriesSelected.bind(this, self)}
            />
          </div>
          <div className="col-md-3">
            <label>Order by field</label>
            <Select
              name="orderByField"
              value={this.state.orderByField}
              options={this.orderByFieldArray}
              onChange={self.orderByFieldSelected.bind(this, self)}
            />
          </div>
          <div className="col-md-3">
            <label>Order by direction</label>
            <Select
              name="orderBySort"
              value={this.state.orderBySort}
              options={this.orderBySortArray}
              onChange={self.orderBySortSelected.bind(this, self)}
            />
          </div>
          <div className="col-md-3">
            <button
              type="button"
              className="btn btn-primary az-margin-top-btn"
              onClick={() => {
                self.getPerformanceData(
                  self.state.numberOfQueries,
                  self.state.orderByField,
                  self.state.orderBySort
                );
              }}
            >
              Refresh
            </button>
          </div>

        </div>

        {table}

      </div>
    );
  }
}
