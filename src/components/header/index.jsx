import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import './index.less';
import menuList from '../../config/menuConfig';
import {formateDate} from '../../utils/dateUtils';
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
//import Item from 'antd/lib/list/Item';
import { Modal} from 'antd'
import LinkButton from "../link-button";

class Header extends Component{
    state={
        currentTime: formateDate(Date.now()),
        //dayPictureUrl: '',
        weather: 'Rain'
    }

    getTime=()=>{
        this.intervalId=setInterval(()=>{
            const currentTime=formateDate(Date.now());
            this.setState({currentTime})
        },1000)
    }
    getTitle(){
        const path=this.props.location.pathname;
        let title;
        menuList.forEach((item)=>{
            if(item.key===path){
                title=item.title;
            }
            else if(item.children){
                const cItem=item.children.find(cItem=>path.indexOf(cItem.key)===0)
                if(cItem){
                    title=cItem.title;
                }
            }
        })
        return title;
    }

    logout = () => {
        Modal.confirm({
            content: 'Comfirm to logout?',
            onOk: () => {
                console.log('OK', this)
                storageUtils.removeUser()
                memoryUtils.user = {}

                this.props.history.replace('/login')
            }
        })
    }

    componentDidMount () {
        this.getTime()
        //this.getWeather()
    }

    UNSAFE_componentWillMount(){
        clearInterval(this.intervalId);
    }

    render(){
        const {currentTime, weather}=this.state;
        const username=memoryUtils.user.username;
        const title=this.getTitle();
        return(
            <div className='header'>
                <div className='header-top'>
                    <span>Welcome, {username}</span>
                    <LinkButton onClick={this.logout}>Logout</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        <img src='http://openweathermap.org/img/wn/10d@2x.png' alt='weather'></img>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header);