import React, {PureComponent} from'react'
import {Form, Input, Select} from 'antd'
import PropTypes from 'prop-types';

const Item=Form.Item;
const Option=Select.Option;

class UserForm extends PureComponent{
    static propTypes = {
        setForm: PropTypes.func.isRequired, 
        roles: PropTypes.array.isRequired,
        user: PropTypes.object,
    }
    UNSAFE_componentWillMount(){
        this.props.setForm(this.props.form)
    }  
    render(){
        const formItemLayout = {
            labelCol: {span:6},
            wrapperCol: {span:16}
        }
        const {roles}=this.props;
        const user=this.props.user||{};
        const {getFieldDecorator}=this.props.form;
        return(
            <div>
                <Form>
                    <Item label='User name' {...formItemLayout}>
                        {
                            getFieldDecorator('username', {
                                initialValue: user.username, 
                                rules: [
                                    {required: true, message: "Must input user name"}
                                ]
                            })(
                                <Input placeholder="Please input user name" />                               
                            )
                        }  
                    </Item>
                    {
                        user._id? null:(                    
                        <Item label='Password' {...formItemLayout}>
                        {
                            getFieldDecorator('password', {
                                initialValue: user.password, 
                                rules: [
                                    {required: true, message: "Must input password"}
                                ]
                            })(
                                <Input type="password" placeholder="Please input password" />                               
                            )
                        }</Item>)
                    }

                    <Item label='Phone' {...formItemLayout}>
                        {
                            getFieldDecorator('phone', {
                                initialValue: user.phone, 
                                rules: [
                                    {required: true, message: "Must input phone"}
                                ]
                            })(
                                <Input placeholder="Please input phone" />                               
                            )
                        }  
                    </Item>
                    <Item label='Email' {...formItemLayout}>
                        {
                            getFieldDecorator('email', {
                                initialValue: user.email, 
                                rules: [
                                    {required: true, message: "Must input email"}
                                ]
                            })(
                                <Input placeholder="Please input email" />                               
                            )
                        }  
                    </Item>
                    <Item label='Role' {...formItemLayout}>
                        {
                            getFieldDecorator('role_id', {
                                initialValue: user.role_id, 
                                rules: [
                                    {required: true, message: "Must select role name"}
                                ]
                            })(
                                <Select>
                                    {
                                        roles.map(role=><Option key={role._id} value={role._id}>{role.name}</Option>)
                                    }
                                </Select>                          
                            )
                        }  
                    </Item>
                </Form>
            </div>
        )
    }
}

export default Form.create()(UserForm);