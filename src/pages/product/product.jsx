import React, {Component} from'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import ProductHome from './home';
import ProductDetail from './detail';
import ProductAddUpdate from './addUpdate';

export default class Product extends Component{
    render(){
        return(
            <div>
                <Switch>
                    <Route path='/product' component={ProductHome} exact></Route>
                    <Route path='/product/addUpdate' component={ProductAddUpdate}></Route>
                    <Route path='/product/detail' component={ProductDetail}></Route>
                    <Redirect to='/product'/>
                </Switch>
            </div>
        )
    }
}

