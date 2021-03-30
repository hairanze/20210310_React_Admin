import React,{Component} from 'react';
import './login.less';
import logo from '../../assets/images/favicon.ico'
import {Form, Icon, Input, Button, message} from 'antd';
import {reqLogin}from '../../api/'
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import { Redirect } from 'react-router';

//const Item=Form.Item;
class Login extends Component{

    handleSubmit=(event)=>{

        event.preventDefault();

        this.props.form.validateFields(async (err, values)=>{
            if(!err){
                //console.log("send ajex", values)
                const {username, password}=values;
                console.log(values);
                const res = await reqLogin(username, password);
                console.log(res);
                if(res.status===0){
                    console.log("login succussfully");
                    message.success("login succussfully");

                    const user=res.data;
                    memoryUtils.user=user;
                    storageUtils.saveUser(user);

                    this.props.history.replace('/');
                }
                else{
                    console.log("login fail");
                    message.error(res.msg);
                }

            }
            else{
                console.log('check fail');
            }
        })
    }

    validatePwd=(rule, value, callback)=>{
        console.log('validatePwd', rule)
        if(!value){
            callback('Empty string');
        }
        else if(value.length<4){
            callback('less than 4');
        }
        else if(value.length>12){
            callback('more than 12');
        }
        else if(/^[a-zA-Z0-9_]+$/.test(value)){
            callback('not regular');
        }
        else{
        callback()}
    }

    render(){
        const user=memoryUtils.user;
        if(user && user._id){
            return <Redirect to='/'/>;
        }

        //const form=this.props.form;
        const {getFieldDecorator}=this.props.form;
        return(
            <div className="login">
                <head className="login-header">
                    <img src={logo} alt='logo'></img>
                    <h1>React Project</h1>
                </head>
                <section className="login-content">
                    <h2>User Login</h2>
                    <div><Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                {getFieldDecorator('username', {
                rules: [
                {required: true, message: '必须输入用户名'},
                {min: 4, message: '用户名最少4位'},
                {max: 12, message: '用户名最多12位'},
                {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文数字下划线'}
                ],
                initialValue:'admin'
                })(
                <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Username"
                />,
                )}
                </Form.Item>
                <Form.Item>
                {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
                initialValue:'123456'    
            })(
                <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="Password"
                />,
                )}
                </Form.Item>
                <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                Log in
                </Button>
                </Form.Item>
                </Form></div>
                </section>
                </div>
                );
                }
}

const WrapLogin=Form.create()(Login)
export default WrapLogin;