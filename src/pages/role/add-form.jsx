import React, {Component} from'react'
import {Form, Input} from 'antd'
import PropTypes from 'prop-types';

const Item=Form.Item;

class AddForm extends Component{
    static propTypes = {
        setForm: PropTypes.func.isRequired, 
    }
    UNSAFE_componentWillMount(){
        this.props.setForm(this.props.form)
    }  
    render(){
        const formItemLayout = {
            labelCol: {span:6},
            wrapperCol: {span:16}
        }
        const {getFieldDecorator}=this.props.form;
        return(
            <div>
                <Form>
                    <Item label='Role name' {...formItemLayout}>
                        {
                            getFieldDecorator('roleName', {
                                initialValue: '', 
                                rules: [
                                    {required: true, message: "Must input role name"}
                                ]
                            })(
                                <Input placeholder="Please input role name" />                               
                            )
                        }  
                    </Item>
                </Form>
            </div>
        )
    }
}

export default Form.create()(AddForm);