import * as React from 'react';
import { Router, Route, HistoryBase } from 'react-router';
import { Layout } from './components/Layout';
import { ConnectionStringSetup } from './components/ConnectionStringSetup';
import { Hello } from './components/Hello';
import { RealTime } from './components/RealTime';
import { QueryData } from './components/QueryData';
import { QueryDetail } from './components/QueryDetail';
import { PerformanceData } from './components/PerformanceData';
import axios from "axios";
import * as NProgress from 'nprogress';

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

//add axios interceptors
axios.interceptors.request.use(function (config) {
    // Do something before request is sent   
    if(config.url != '/api/realtimedata/cpu')
      NProgress.start();
    return config;
  }, function (error) {
     NProgress.done();
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Do something with response data
    NProgress.done();
    return response;
  }, function (error) {
     NProgress.done();
    // Do something with response error
    return Promise.reject(error);
  });
