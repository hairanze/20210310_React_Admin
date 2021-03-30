import React, {Component} from'react';
import {Card, Button, Table, Modal, message} from 'antd';
import LinkButton from '../../components/link-button';
import {PAGE_SIZE} from '../../utils/constants'
import {formateDate} from "../../utils/dateUtils"
import {reqUsers, reqDeleteUser, reqAddOrUpdateUser} from '../../api';
import UserForm from './user-form'
export default class User extends Component{
    state={
        users: [], 
        roles: [],
        isShow: false,
        user: {},
    }
    initColumns=()=>{
        this.columns=[
            {
                title:'username',
                dataIndex:'username'
            },
            {
                title:'email',
                dataIndex:'email'
            },
            {
                title:'phone',
                dataIndex:'phone'
            },
            {
                title:'creat time',
                dataIndex:'create_time',
                render: formateDate,
            },
            {
                title:'role_id',
                dataIndex:'role_id',
                render: (role_id)=>this.roleNames[role_id],
            },
            {
                title:'operation',
                render: (user)=>(
                    <span>
                        <LinkButton onClick={()=>this.showUpdate(user)}>Modify</LinkButton>
                        <LinkButton onClick={()=>this.deleteUser(user)}>Delete</LinkButton>
                    </span>
                )
            },
        ]
    }
    initRoleNames=(roles)=>{
        const roleNames=roles.reduce((pre,role)=>{
            pre[role._id]=role.name;
            return pre;
        }, {});
        this.roleNames=roleNames;
    }
    UNSAFE_componentWillMount(){
        this.initColumns();
    }
    componentDidMount(){
        this.getUsers();
    }
    getUsers=async()=>{
        const result=await reqUsers();
        console.log("getUsers()",result);
        if(result.status===0){
            const {roles, users}=result.data;
            this.initRoleNames(roles);
            this.setState({roles, users});
        }
    }
    addOrUpdateUser=async()=>{
        this.setState({isShow: false});
        const user= this.form.getFieldsValue();
        this.form.resetFields();
        if(this.user){
            user._id=this.user._id;
        }
        const result = await reqAddOrUpdateUser(user);
        if(result.status===0){
            message.success(`${this.user?"Modify":"Add"} user success`);
            this.getUsers();
        }
        else{
            message.error(`${this.user?"Modify":"Add"} user fail`);
        }
    }
    deleteUser=(user)=>{
        Modal.confirm({
            title: `Confirm delete ${user.username}?`,
            onOk:async()=>{
                const result=await reqDeleteUser(user);
                if(result.status===0){
                    message.success('Delete success');
                    this.getUsers();
                }
                else{
                    message.error('Delete fail');
                }
            }
        })
    }
    showUpdate=(user)=>{
        this.user=user;
        this.setState({isShow:true});
    }
    showAdd=()=>{
        this.user=null;
        this.setState({isShow:true});
    }
    render(){
        const {users, roles, isShow}=this.state;
        const user=this.user;
        const title= <Button type='primary' onClick={()=> this.showAdd()}>Create user</Button>
        return(
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={users}
                    columns={this.columns}
                    pagination={{
                        defaultPageSize: PAGE_SIZE, 
                        showQuickJumper: true,}}/>

                <Modal
                    title={user ? "Modify user":"Add user"}
                    visible={isShow} 
                    onOk={this.addOrUpdateUser}
                    onCancel={()=>{
                        this.form.resetFields();
                        this.setState({isShow: false})}}
                >
                    <UserForm 
                        setForm={form=>this.form=form} 
                        roles={roles}
                        user={user}
                    />
                </Modal>
            </Card>
        )
    }
}

