import * as React from 'react';
import { Router, Route, HistoryBase } from 'react-router';
import { Layout } from './components/Layout';
import { ConnectionStringSetup } from './components/ConnectionStringSetup';
import { Hello } from './components/Hello';
import { RealTime } from './components/RealTime';
import { QueryData } from './components/QueryData';
import { QueryDetail } from './components/QueryDetail';
import { PerformanceData } from './components/PerformanceData';

export default <Route component={ Layout }>
    <Route path='/' components={{ body: ConnectionStringSetup }} />   
    <Route path='/release-notes' components={{ body: Hello }} />   
    <Route path='/realtime' components={{ body: RealTime }} />
    <Route path='/queries' components={{ body: QueryData }} />
    <Route path='/queries/detail/:queryId' components={{ body: QueryDetail }} />   
    <Route path='/performance' components={{ body: PerformanceData }} />  
</Route>;

// Allow Hot Module Reloading
declare var module: any;
if (module.hot) {
    module.hot.accept();
}
