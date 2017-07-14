import * as React from "react";
import "isomorphic-fetch";
import { Line } from "react-chartjs-2";
import axios from "axios";

const initialState = {
  avgCpu: 20,
  maxCpu: 80,
  maxDtu: 100,
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "% of CPU x 15 sec",
      backgroundColor: [
        "rgba(65, 137, 199, 0.2)"
      ],
      borderColor: [
        "rgba(65, 137, 199, 1)"
      ],
      borderWidth: 2,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40]
    }
  ]
};

const Graph = React.createClass({
  displayName: "Graph",

  componentWillMount() {
    this.setState(initialState);
  },

  componentDidMount() {
    var _this = this;

    const sumArray = function sumArray(arr) {
      var result = 0;

      if (arr.length > 0) {
        for (var i = 0; i < arr.length; i++) {
          result += arr[i]; //don't forget to add the base
        }
      }

      return result;
    };

    const fixDateTime = function(date) {
      var hours = date.substr(11, 2);
      var minutes = date.substr(14, 2);
      var seconds = date.substr(17, 2);

      var utcAdjustedHours = parseInt(hours) + 2;

      return utcAdjustedHours + ":" + minutes + ":" + seconds;
    };

    const getData = function() {
      axios
        .get("/api/realtimedata/cpu")
        .then(response => response.data as Promise<RealTimeRow[]>)
        .then(data => {
          var oldDataSet = _this.state.datasets[0];

          //calcolo le nuove label
          var newLabels = data.map(row => fixDateTime(row.endTime));
          _this.state.labels = newLabels;
          //calcolo i nuovi dati
          var newCpuData = data.map(row => row.avgCpuPercent);

          //calcolo il dtulimit
          var dtus = data.map(row => row.dtuLimit);
          var absoluteDtu = Math.max.apply(Math, dtus);

          //calcolo l'average cpu
          var avg = 0;
          var avgCpuArr = data.map(row => row.avgCpuPercent);
          if (avgCpuArr.length){
              var avgCalc = sumArray(avgCpuArr) / avgCpuArr.length;
              avg = parseFloat(avgCalc.toFixed(3));
          } 
            
          //calcolo il max della cpu
          var maxCpu = Math.max.apply(Math, avgCpuArr).toFixed(3);

          var newDataSet = {
            ...oldDataSet
          };

          newDataSet.data = newCpuData;

          var newState = {
            ...initialState,
            avgCpu: avg,
            maxCpu: maxCpu,
            maxDtu: absoluteDtu,
            labels: newLabels,
            datasets: [newDataSet]
          };

          _this.setState(newState);
        });
    };

    getData();

    setInterval(function() {
      getData();
    }, 15000);
  },

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <Line
              data={this.state}
              width={1200}
              height={800}
              options={{
                animation: false,
                maintainAspectRatio: false,
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                        suggestedMin: 0,
                        suggestedMax: 100
                      }
                    }
                  ]
                }
              }}
            />
          </div>
        </div>
        <div className="row az-margin-top">
          <div className="col-lg-4">
            <div className="ibox float-e-margins">
              <div className="ibox-title">
                <h5>Average CPU</h5>
              </div>
              <div className="ibox-content">
                <h1 className="no-margins">{this.state.avgCpu} %</h1>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="ibox float-e-margins">
              <div className="ibox-title">
                <h5>Maximum CPU</h5>
              </div>
              <div className="ibox-content">
                <h1 className="no-margins">{this.state.maxCpu} %</h1>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="ibox float-e-margins">
              <div className="ibox-title">
                <h5>Available DTU</h5>
              </div>
              <div className="ibox-content">
                <h1 className="no-margins">{this.state.maxDtu}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export class RealTime extends React.Component<any, void> {
  constructor() {
    super();
  }

  public render() {
    return <Graph />;
  }
}

