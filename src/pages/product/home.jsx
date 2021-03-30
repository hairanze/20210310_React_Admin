import React, {Component} from'react'
import {Button, Card, Table, Icon, Input, Select, message} from 'antd';
import LinkButton from '../../components/link-button';
import {reqProducts, reqSearchProducts, reqUpdateStatus} from '../../api';
import {PAGE_SIZE} from '../../utils/constants'

const Option=Select.Option;

export default class ProductHome extends Component{
    state={
        total: 0, 
        products: [], 
        loading: false, 
        searchName: '', 
        searchType: 'productDesc', 
    }

    initColumns=()=>{
        this.columns=[
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Desription',
            dataIndex: 'desc',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            render: (price)=> '¥' + price
        },
        {
            title: 'Status', 
            width: 100, 
            render: (product)=>{
                const {status, _id}=product;
                const newStatus= status===1? 2:1;
                return(
                    <span>
                        <Button 
                        type='primary' 
                        onClick={()=>this.updateStatus(_id, newStatus)}>
                            {status==='1' ? "Put off shelf": "Put on shelf"}</Button>
                        <span>{status==='1' ? "On sell":"Off shelf"}</span>
                    </span>                    
                )
            }
        }, 
        {
            title: 'Operation', 
            width: 100, 
            render: (product)=>{
                return(
                    <span>
                        <LinkButton onClick={()=>this.props.history.push('/product/detail', {product})}>Details</LinkButton>
                        <LinkButton onClick={()=>this.props.history.push('/product/addUpdate', product)}>Modify</LinkButton>
                    </span>
                )
            }
        }]
    }

    UNSAFE_componentWillMount(){
        this.initColumns();
    }

    componentDidMount(){}

    getProducts= async(pageNum)=>{
        this.pageNum=pageNum;
        this.setState({loading: true});
        const {searchName, searchType}=this.state;
        let result;
        if(searchName){
            result= await reqSearchProducts({pageNum, pageSize: PAGE_SIZE,searchName, searchType})
        }
        else{
            result = await reqProducts(pageNum, PAGE_SIZE);
        } 
        
        this.setState({loading: false});
        if(result.status===0){
           const {total, list}=result.data;
           this.setState({
               total: total, 
               products: list, 
           })
        }
    }
    updateStatus=async(productId, status)=>{
        const result=await reqUpdateStatus(productId, status);
        if(result.status===0){
            message.success("Update successfully");
            this.getProducts(this.pageNum);
        }
        else{
        }
    }
    render(){
        const {products, total, loading, searchName, searchType} = this.state;
        const title=(
            <span>
                <Select 
                value={searchType} 
                style={{width: '150px'}} 
                onChange={value=>this.setState({searchType: value})}>
                    <Option value='productName'>Search by name</Option>
                    <Option value='productDesc'>Search by description</Option>                    
                </Select>
                <Input 
                placeholder='keyword' 
                style={{width: '150px', margin: '0 15px'}} 
                value={searchName}
                onChange={event=>this.setState({searchName: event.target.value})}></Input>
                <Button 
                type='primary'
                onClick={()=>this.getProducts(1)}>Search</Button>
            </span>
        )

        const extra=(
            <span> 
                <Button type='primary' onClick={()=>this.props.history.push('/product/addUpdate')}>
                    <Icon type='plus'/>Add
                </Button>
            </span>
        )
        return(
            <div>
                <Card title={title} extra={extra}>
                    <Table
                        bordered
                        rowKey='_id'
                        dataSource={products}
                        columns={this.columns}                        
                        loading={loading}
                        pagination={{
                            current: this.pageNum,
                            total: total,
                            defaultPageSize: PAGE_SIZE, 
                            showQuickJumper: true,
                            onChange: this.getProducts,}}/>
                </Card>
            </div>
        )
    }
}

