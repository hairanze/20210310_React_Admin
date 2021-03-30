import React, {Component} from'react';
import {Card, Table, Button, Modal, message} from 'antd';
import {reqRoles, reqAddRole, reqUpdateRole} from '../../api';
import AddForm from './add-form';
import AuthForm from './auth-form';
import {formateDate} from "../../utils/dateUtils"
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';

export default class Role extends Component{
    constructor(props){
        super(props);
        this.auth=React.createRef();
    }
    state={
        roles: [],
        role: {},
        isShowAdd: false, 
        isShowAuth: false, 
    }
    initColumn=()=>{
        this.columns=[
            {
                title: 'Role name',
                dataIndex: 'name',
            },
            {
                title: 'Create time',
                dataIndex: 'create_time',
                render: formateDate,
            },
            {
                title: 'Auth time',
                dataIndex: 'auth_time',
                render: formateDate,
            },
            {
                title: 'Auth name',
                dataIndex: 'auth_name',
            },
        ]
    }
    getRoles=async()=>{
        const result=await reqRoles();
        if(result.status===0){
            console.log("getRoles() success");
            const roles=result.data;
            this.setState({roles});
        }
        else{
            console.log("getRoles() faile");
        }
    }
    addRole=()=>{
        this.form.validateFields(async(error, values)=>{
            if(!error){
                const {roleName}=values;
                this.form.resetFields();
                const result = await reqAddRole(roleName);
                this.handleAddDisplay(false);
                if(result.status===0){
                    message.success("reqAddRole success");
                    const role=result.data;
                    this.setState(state=>({roles: [...state.roles, role]}));
                }else{
                    message.error("reqAddRole fail");
                }
            }
        })
    }
    updateRole=async()=>{
        this.handleUpdateDisplay(false);
        const {role}=this.state;
        const menus=this.auth.current.getMenus();
        role.menus=menus;
        const result=await reqUpdateRole(role);
        if(result.status===0){
            if(role._id===memoryUtils.user.role_id){
                memoryUtils.user={};
                storageUtils.removeUser();
                this.props.history.replace('/login');
                message.success("updateRole current success");
            }
            else{
                this.setState({roles: [...this.state.roles]});
                message.success("updateRole success");}
        }
        else{
            message.error("updateRole error");
        }
    }
    UNSAFE_componentWillMount(){
        this.initColumn();
    }
    componentDidMount(){
        this.getRoles();
    }
    onRow=(role)=>{
        return{
            onClick:event=>{
                alert("click()", role);
                this.setState({role});
            }
        }
    }
    handleAddDisplay=(flag)=>{
        if(flag===true){
            this.setState({isShowAdd: true});
        }
        else if(flag===false){
            this.setState({isShowAdd: false});
        }
    }
    handleUpdateDisplay=(flag)=>{
        if(flag===true){
            this.setState({isShowAuth: true});
        }
        else if(flag===false){
            this.setState({isShowAuth: false});
        }
    }
    render(){
        const {roles, role, isShowAdd, isShowAuth}=this.state;
        const title=(
            <span>
                <Button type='primary' onClick={()=>this.handleAddDisplay(true)}>Create Role</Button> &nbsp;&nbsp;
                <Button type='primary' onClick={()=>this.handleUpdateDisplay(true)} disabled={!role._id}>Setup Role</Button>
            </span>
        )
        
        return(
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{
                        defaultPageSize: 5, 
                        showQuickJumper: true}}
                    onRow={this.onRow}
                    rowSelection={{
                        type: 'radio', 
                        selectedRowKeys: [role._id],
                        onSelect: (role)=>{
                            this.setState({role})
                        }}}/>
                
                <Modal
                    title="Add role"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={()=>this.handleAddDisplay(false)}>
                    <AddForm
                        setForm={(form)=>{this.form=form}}
                    />
                </Modal>

                <Modal
                    title="Update role"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={()=>this.handleUpdateDisplay(false)}>
                    <AuthForm ref={this.auth} role={role} />
                </Modal>
            </Card>
        )
    }
}

