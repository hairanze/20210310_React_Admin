import React, {Component} from'react';
import {Card, Icon, Form, Input, Cascader, Button, message} from 'antd';
import LinkButton from '../../components/link-button';
import { reqCategorys, reqAddOrUpdateProduct } from '../../api';
import PicturesWall from "./pictures-wall";
import RichTextEditor from './rich-text-editor'

const {Item}=Form;
const {TextArea}=Input;

class ProductAddUpdate extends Component{
    state={
        options: [], 
    }
    constructor(props){
        super(props);
        this.pw=React.createRef();
        this.editor=React.createRef();
    }
    initOptions = async (categorys) => {
        const options = categorys.map(item=>({
            value: item._id,
            label: item.name,
            isLeaf: false,
        }));
        const {isUpdate, product}=this;
        const {pCategoryId}=product;
        console.log(product);
        if(isUpdate && pCategoryId!=='0'){
            const subCategorys = await this.getCategorys(pCategoryId);
            const childOptions=subCategorys.map(item=>({
                value: item._id,
                label: item.name,
                isLeaf: true,
            }));
            const targetOption=options.find(option=>option.value===pCategoryId);
            targetOption.children=childOptions;
        }
        this.setState({options});
    }

    submit=()=>{
        this.props.form.validateFields(async (error, values)=>{
            if(!error){
                const {name, price, desc, categoryIds}=values;
                let pCategoryId, categoryId;
                if(categoryIds.length===1){
                    pCategoryId='0';
                    categoryId=categoryIds[0];
                }
                else{
                    pCategoryId=categoryIds[0];
                    categoryId=categoryIds[1];
                }
                const imgs = this.pw.current.getImgs();
                const detail=this.editor.current.getDetail();
                const product={name, desc, price, imgs, detail, pCategoryId, categoryId};
                if(this.isUpdate){
                    product._id=this.product._id;
                }
                console.log("product: ",product);
                const result = await reqAddOrUpdateProduct(product);
                console.log("result=",result);
                if(result.status===0){
                    message.success(`${this.isUpdate ? 'Update': 'Add'} product success`);
                    console.log("result: ",result);
                    this.props.history.goBack();
                }
                else{
                    message.error(`${this.isUpdate ? 'Update': 'Add'} product fail`);
                }
            }
        })
    }

    getCategorys = async (parentId)=>{
        const result = await reqCategorys(parentId);
        if(result.status===0){
            const categorys=result.data;
            if(parentId==='0'){
            this.initOptions(categorys);
            }
            else{
                return categorys;
            }
        }
    }

    validatePrice=(rule,value, callback)=>{
        if(value*1>0){
            callback();
        }
        else{
            callback("Must larger than 0")
        }
    }

    loadData = async selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        const subCategorys= await this.getCategorys(targetOption.value)
        targetOption.loading = false;
        if(subCategorys && subCategorys.length>0){
            const childOptions = subCategorys.map(item=>({
                value: item._id,
                label: item.name,
                isLeaf: true,
            }));
            targetOption.children=childOptions;
        }
        else{targetOption.isLeaf=true;}

        this.setState({
        options: [...this.state.options],
        });
      };

    componentDidMount(){
        this.getCategorys('0')
    }

    UNSAFE_componentWillMount(){
        const product=this.props.location.state;
        this.isUpdate=!!product;
        this.product=product||{};
    }

    render(){
        const {isUpdate, product}=this;
        const {pCategoryId, categoryId, imgs, detail}=product;
        console.log("pCategoryId",pCategoryId,"categoryId",categoryId,"imgs",imgs,"detail",detail);
        const categoryIds=[];

        const formItemLayout ={
            labelCol:{span:5}, 
            wrapperCol: {span: 15}
        }
        
        if(isUpdate){
            if(pCategoryId==='0'){
                categoryIds.push(categoryId);
            }
            else{
                categoryIds.push(pCategoryId);
                categoryIds.push(categoryId);
            }
            
        }
        const title=(
            <span>
                <LinkButton 
                style={{marginRight: '15px', fontSize: "20"}} 
                onClick={() => this.props.history.goBack()}>
                <Icon type="arrow-left"></Icon>
                </LinkButton>
                <span>{isUpdate?"Modify":"Add"}</span>
            </span>
        );
        const {getFieldDecorator} = this.props.form;
        return(
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label="Item name: ">
                        {
                            getFieldDecorator('name', {
                                initialValue: product.name,
                                rules: [{required: true, message: "Must input item name"}]
                            })(<Input placeholder='Please input item name'/>)
                        }
                    </Item>
                    <Item label="Item desciption: ">
                        {
                            getFieldDecorator('desc', {
                                initialValue: product.desc,
                                rules: [{required: true, message: "Must input item description"}]
                            })(<TextArea placeholder='Please input item description' autosize={{minRows: 2, maxRows: 6}}/>)
                        }
                    </Item>
                    <Item label="Item price: ">
                        {
                            getFieldDecorator('price', {
                                initialValue: product.price,
                                rules: [{required: true, message: "Must input item price"}, 
                                {validator: this.validatePrice}
                            ]
                            })(<Input type='number' placeholder='Please input item price' addonBefore="S $"/>)
                        }
                    </Item>
                    <Item label="Item classifcation: ">
                        {
                            getFieldDecorator('categoryIds', {
                                initialValue: categoryIds,
                                rules: [{required: true, message: "Must input item class"}, 
                            ]
                            })(<Cascader
                                placeholder='Please select item class'
                                options={this.state.options}
                                loadData={this.loadData}
                                />)
                        }

                    </Item>
                    <Item label="Item image: ">
                        <PicturesWall ref={this.pw} imgs={imgs}/>
                    </Item>
                    <Item label="Item details: " labelCol={{span:5}} wrapperCol= {{span: 16}}>
                        <RichTextEditor ref={this.editor} detail={detail}/>
                    </Item>
                    <Item>
                        <Button type="primary" onClick={this.submit}>Submit</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}

export default Form.create()(ProductAddUpdate);
