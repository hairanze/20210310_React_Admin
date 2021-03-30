import React, {Component} from'react'
import {Form, Select, Input} from 'antd'
import PropTypes from 'prop-types';

const Item=Form.Item;
const Option=Select.Option;

class AddForm extends Component{
    static propTypes = {
        categorys: PropTypes.array.isRequired, 
        parentId: PropTypes.string.isRequired, 
        setForm: PropTypes.func.isRequired, 
    }
    UNSAFE_componentWillMount(){
        this.props.setForm(this.props.form)
    }  
    render(){
        const {categorys, parentId}=this.props;
        const {getFieldDecorator}=this.props.form;
        return(
            <div>
                <Form>
                    <Item>
                        {
                            getFieldDecorator('parentId', {
                                initialValue: parentId
                            })(
                                <Select>
                                    <Option value='0'>First level label</Option>
                                    {
                                        categorys.map((item, index)=> <Option key={index} value={item.id}>{item.name}</Option>)
                                    }
                                </Select>                                  
                            )
                        }
                      
                    </Item>
                    <Item>
                        {
                            getFieldDecorator('categoryName', {
                                initialValue: '', 
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

export default Form.create()(AddForm);
