import * as React from "react";

export class Hello extends React.Component<any, void> {
  public render() {
    return (
      <div>
        <h1>pod.camp sql azure monitor center</h1>
        <h2>Facile, facilissimo!!!</h2>

        <h3>changelog (26/06/2017)</h3>
        <ul className="list">
          <li><span>Added performance data section</span></li>  
        </ul>

        <h3>changelog (23/06/2017)</h3>
        <ul className="list">
          <li><span>Added query detail</span></li>
          <li><span>Added query download</span></li>
          <li><span>Several graphical improvements</span></li>
          <li>
            <span>
              Code base refactoring for better readibility and maintenace
            </span>
          </li>
        </ul>
      </div>
    );
  }
}