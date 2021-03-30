import React, {Component} from'react';
import {Button, Card, Table, Icon, message, Modal} from 'antd';
import LinkButton from '../../components/link-button';
import {reqAddCategory, reqCategorys, reqUpdateCategory} from '../../api';
import AddForm from './addForm'
import UpdateForm from './updateForm'

export default class Category extends Component{
    state={
        loading: false,
        categorys : [], 
        subCategorys: [],
        parentId: '0',
        parentNmae: '', 
        showStatus: 0, //0: null, 1: add, 2: modify
    }

    initColumns=()=>{
        this.columns =[
            {
                title: 'label name',
                dataIndex: 'name',
            },
            {
                title: 'Operate', 
                width: 300, 
                render: (category)=>(
                    <span>
                        <LinkButton onClick={()=>this.showUpdate(category)}>Modify</LinkButton>
                        {this.state.parentId==='0' ? <LinkButton onClick={()=>{this.showSubCategorys(category)}}>Show sub categoty</LinkButton>: null}
                    </span>
                )
            }
        ]
    }

    showSubCategorys=(category)=>{
        console.log("showSubCategorys()");
        this.setState({
            parentId: category._id, 
            parentName: category.name, 
        }, ()=>{
            console.log('parentId: ', this.state.parentId);
            console.log("parentName: "+this.state.parentName);
            this.getCategorys();
        })
    }

    showCategorys=()=>{
        console.log("showCategorys()");
        this.setState({
            parentId: '0',
            parentNmae: '',
            subCategorys: [],
        })
    }

    getCategorys= async (parentId) => {
        this.setState({loading: true});
        parentId = parentId || this.state.parentId;
        const result = await reqCategorys(parentId);
        this.setState({loading: false});
        if(result.status===0){
            const categorys =result.data;
            if(parentId==='0'){
                this.setState({
                    categorys: categorys
                })                
            }
            else{
                this.setState({
                    subCategorys: categorys
                })  
            }

        }
        else{
            message.error('fail to get categorys');
        }
    }

    handCancel=()=>{
        this.form.resetFields();
        this.setState({
            showStatus: 0,
        })
    }

    showAdd=()=>{
        console.log("showAdd()");
        this.setState({
            showStatus: 1,
        })
    }

    showUpdate=(category)=>{
        this.category=category;
        console.log("showUpdate()");
        this.setState({
            showStatus: 2,
        })
    }

    addCategory=()=>{
        console.log("addCategory()");
        this.form.validateFields(async(err, values)=>{
            if(!err){        
                this.setState({
                    showStatus: 0,
                })                
                const {parentId, categoryName} =values; 
                console.log(values);
                console.log(parentId+" "+categoryName);
                this.form.resetFields();
                const result = await reqAddCategory(categoryName, parentId);
                if(result.status===0){
                    if(parentId===this.state.parentId){
                        this.getCategorys();
                    }
                    else if(parentId==='0'){
                        this.setState({parentId: '0'}, ()=>{
                            this.getCategorys('0');
                        })
                    }
                }
            }
        })


    }

    UpdateCategory=()=>{
        this.form.validateFields(async(err, values)=>{
            if(!err){
                this.setState({
                    showStatus: 0,
                })

                const categoryId=this.category._id;
                const {categoryName}=values;

                this.form.resetFields();
                const result=await reqUpdateCategory({categoryId, categoryName});

                if(result.status===0){
                    this.getCategorys();
                }                
            }
        })


    }

    UNSAFE_componentWillMount(){
        this.initColumns();
    }

    componentDidMount(){
        this.getCategorys();
    }
    render(){
        const {categorys, loading, parentId, parentName, subCategorys, showStatus}=this.state;
        const title= parentId==='0' ? 'First level title' : (
        <span>
            <LinkButton onClick={this.showCategorys}>First level title</LinkButton>
            <Icon type='arrow-right' style={{marginRight: '5px'}}></Icon>
            <span>{parentName}</span>
        </span>);
        const extra=(
            <Button type='primary' onClick={this.showAdd}>
            <Icon type='plus'></Icon>
            </Button>
        );
        const category = this.category || {};

        return(
            <div>
                <Card title={title} extra={extra}>
                    <Table
                        border
                        rowKey='_id'
                        loading={loading}
                        dataSource={ parentId==='0'? categorys: subCategorys}
                        columns={this.columns}
                        pagination={{
                            defaultPageSize: 10, 
                            showQuickJumper: true
                            }}>
                    </Table>

                <Modal
                    title="Add"
                    visible={showStatus===1} 
                    onOk={this.addCategory}
                    onCancel={this.handCancel}
                >
                    <AddForm 
                    categorys={categorys} 
                    parentId={parentId}
                    setForm={(form)=>{this.form=form}}/>
                </Modal>

                <Modal
                    title="Update"
                    visible={showStatus===2} 
                    onOk={this.UpdateCategory}
                    onCancel={this.handCancel}
                >
                    <UpdateForm 
                    categoryName={category.name}
                    setForm={(form)=>{this.form=form}}/>
                </Modal>
                </Card>
            </div>
        )
    }
}

