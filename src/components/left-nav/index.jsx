import React, {Component} from 'react';
import './index.less'
import logo from '../../assets/images/favicon.ico'
import {Link, withRouter} from 'react-router-dom'
import { Menu, Icon } from 'antd';
import menuList from "../../config/menuConfig"
import memoryUtils from '../../utils/memoryUtils'
const { SubMenu } = Menu;

export class LeftNav extends Component{
  hasAuth=(item)=>{
    const {key, isPublic}=item.key;
    const menus=memoryUtils.user.role.menus;
    const username=memoryUtils.user.username;
    if(username==='admin' || isPublic || menus.indexOf(key)!==-1){
      return true;
    }
    else if(item.children){
      return !!item.children.find(child=>menus.indexOf(child.key)!==-1);
    }
    return false;
  }
    getMenuList=(menuList)=>{
        return menuList.map(item=>{
            if(!item.children) {
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                        <Icon type={item.icon}/>
                        <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            } 
            else {
                return (
                <SubMenu
                    key={item.key}
                    title={
                    <span>
                    <Icon type={item.icon}/>
                    <span>{item.title}</span>
                    </span>
                    }
                >
                    {this.getMenuList(item.children)}
                </SubMenu>
                )
            }
        })
    }

    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname
    
        return menuList.reduce((pre, item) => {
          if(this.hasAuth(item))
            if(!item.children) {
              pre.push((
                <Menu.Item key={item.key}>
                  <Link to={item.key}>
                    <Icon type={item.icon}/>
                    <span>{item.title}</span>
                  </Link>
                </Menu.Item>
              ))
            } 
            else {
              const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
              if (cItem) {
                this.openKey = item.key
              }

              pre.push((
                <SubMenu
                  key={item.key}
                  title={
                    <span>
                  <Icon type={item.icon}/>
                  <span>{item.title}</span>
                </span>
                  }
                >
                  {this.getMenuNodes(item.children)}
                </SubMenu>
              ))
            }
          
    
          return pre},[])
      }

    state = {
        collapsed: false,
      };

    UNSAFE_componentWillMount(){
        this.menuNodes=this.getMenuNodes(menuList);
    }

    render(){
        let path=this.props.location.pathname;
        if(path.indexOf('/product')===0){
            path='/product';
        }

        const  openKey=this.openKey;
        return(
            <div className='left-nav'>
                <Link to='/' className='left-nav-header'>
                    <img src={logo} alt="logo"/>
                    <h1>React Project</h1>
                </Link>
                <Menu
                defaultSelectedKeys={[path]}
                defaultOpenKeys={[openKey]}
                mode="inline"
                theme="dark"
                >
                {
                    this.menuNodes
                }
                </Menu>
            </div>
        )
    }
}

export default withRouter(LeftNav);