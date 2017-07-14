import * as React from 'react';
import { Link } from 'react-router';

export class NavMenu extends React.Component<any, void> {
    public render() {
        return <div className='main-nav'>
                <div className='navbar navbar-inverse'>
                <div className='navbar-header'>
                    <button type='button' className='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>
                        <span className='sr-only'>Toggle navigation</span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                    </button>
                    <Link className='navbar-brand' to={ '/realtime' }>Sql azure monitor</Link>
                </div>
                <div className='clearfix'></div>
                <div className='navbar-collapse collapse'>
                    <ul className='nav navbar-nav'>
                        <li>
                            <Link to={'/realtime'} activeClassName='active'>
                                <span className='glyphicon glyphicon-equalizer'></span> Real time graph
                            </Link>
                        </li>
                        <li>
                            <Link to={ '/queries' } activeClassName='active'>
                                <span className='glyphicon glyphicon-th-list'></span> Real time query
                            </Link>
                        </li>
                        <li>
                            <Link to={'/performance'} activeClassName='active'>
                                <span className='glyphicon glyphicon-signal'></span> Performance data
                            </Link>
                        </li>
                         <li>
                            <Link to={ '/release-notes' } activeClassName='active'>
                                <span className='glyphicon glyphicon-home'></span> Release notes
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>;
    }
}
