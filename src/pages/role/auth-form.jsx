import React, {Component} from'react';
import {Form, Input, Tree} from 'antd';
import PropTypes from 'prop-types';
import menuList from '../../config/menuConfig';

const Item=Form.Item;
const { TreeNode } = Tree;

export default class AuthForm extends Component{
    constructor(props){
        super(props);
        const menus=this.props.role;
        this.state={
            checkedKeys:menus,
        }
    }
    
    static propTypes = {
        role: PropTypes.object.isRequired, 
    }
    UNSAFE_componentWillMount(){
        this.treeNodes=this.getTreeNodes(menuList);
    }
    getTreeNodes = (menuList) => {
        return menuList.reduce((pre, item) => {
          pre.push(
            <TreeNode title={item.title} key={item.key}>
              {item.children ? this.getTreeNodes(item.children) : null}
            </TreeNode>
          )
          return pre
        }, [])
      }

    onCheck = (checkedKeys) => {
        //console.log('onCheck', checkedKeys);
        this.setState({checkedKeys});
    };
    getMenus=()=>{
        return this.state.checkedKeys;
    }
    render(){
        const {role}=this.props;
        const {checkedKeys}=this.state;
        const formItemLayout = {
            labelCol: {span:6},
            wrapperCol: {span:16}
        }
        return(
            <div>
                <Item label='Role name' {...formItemLayout}>
                    <Input value={role.name} disabled/>                               
                </Item>

                <Tree checkable 
                defaultExpandAll={true} 
                checkedKeys={checkedKeys}
                onCheck={this.onCheck}>
                    <TreeNode title="Platform Auth" key="all">
                        {this.treeNodes};
                    </TreeNode>
                </Tree>
            </div>
        )
    }
}