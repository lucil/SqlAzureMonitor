import * as React from 'react';
import { NavMenu } from './NavMenu';

export interface LayoutProps {
    body: React.ReactElement<any>;
}

export class Layout extends React.Component<LayoutProps, void> {
    public render() {
        const currentPath = window.location.pathname;

        return <div>
            <div className='container-fluid'>
                {!(currentPath == '/') ?
                    <div className='row'>
                        <div className='col-sm-2'>
                            <NavMenu />
                        </div>
                        <div className='col-sm-10'>
                            {this.props.body}
                        </div>
                    </div>
                    : <div className='col-sm-12'>
                        {this.props.body}
                    </div>}
            </div>
            {(currentPath == '/') ?
                <footer className="footer">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-sm-12 text-right">
                                <a  href="/terms">Terms and conditions</a>
                                <a className="az-padding-left">Github</a>
                                <a className="az-padding-left" href="http://pcodelab.com" target="_blank">pCodeLab</a>
                                
                            </div>
                        </div>
                    </div>
                </footer> : null
            }
        </div>;
    }
}