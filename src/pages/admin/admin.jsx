import React,{Component} from 'react';
import { Redirect, Route, Switch } from 'react-router';
import memoryUtils from "../../utils/memoryUtils";
import { Layout } from 'antd';
import LeftNav from '../../components/left-nav';
import Header from '../../components/header';
import Home from '../home/home';
import Product from '../product/product';
import Role from '../role/role';
import Category from '../category/category';
import User from '../user/user';
import Bar from '../charts/bar';
import Pie from '../charts/pie';
import Line from '../charts/line';

const { Footer, Sider, Content } = Layout;
export default class Admin extends Component{
    
    render(){
        const user=memoryUtils.user;
        if(!user || !user._id){
            return <Redirect to='/login'/>
        }
        return(
            <div>
                <Layout style={{minHeight: '100vh'}}>
                    
                    <Sider>
                        <LeftNav/>
                    </Sider>
                    <Layout>
                        <Header>Header</Header>
                        <Content style={{backgroundColor: '#fff', margin: '20px'}}>
                            <Switch>
                                <Redirect from='/' exact to='/home'/>
                                <Route path='/home' component={Home}/>
                                <Route path='/category' component={Category}/>
                                <Route path='/product' component={Product}/>
                                <Route path='/user' component={User}/>
                                <Route path='/role' component={Role}/>
                                <Route path="/charts/bar" component={Bar}/> 
                                <Route path="/charts/pie" component={Pie}/>
                                <Route path="/charts/line" component={Line}/>
                                <Redirect to='/home'/>
                            </Switch>
                        </Content>
                        <Footer style={{textAlign: 'center', color:'#cccccc', height: '40px'}}>
                            Please use Chrome</Footer>                        
                    </Layout>
                </Layout>
            </div>
        )
    }
}