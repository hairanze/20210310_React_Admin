import React, {Component} from'react';
import {Form, Input} from 'antd';
import PropTypes from 'prop-types';

const Item=Form.Item;

class UpdateForm extends Component{
    static propTypes = {
        categoryName: PropTypes.string.isRequired, 
        setForm: PropTypes.func.isRequired, 
    }    
    UNSAFE_componentWillMount(){
        this.props.setForm(this.props.form)
    }
    render(){
        const {categoryName} = this.props;
        const {getFieldDecorator}=this.props.form;
        return(
            <div>
                <Form>
                    <Item>
                        {
                            getFieldDecorator('categoryName', {
                                initialValue: categoryName,
                                rules: [
                                    {required: true, message: "Must input"}
                                ]
                            })(
                                <Input placeholder="Please input" />                               
                            )
                        }  
                    </Item>
                </Form>
            </div>
        )
    }
}

export default Form.create()(UpdateForm);
