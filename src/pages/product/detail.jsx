import React, {Component} from'react';
import {Card, List, Icon} from 'antd';
import './product.less'
import LinkButton from '../../components/link-button';
import {BASE_IMG_URL} from '../../utils/constants'
import { reqCategory } from '../../api';

const Item=List.Item;

export default class ProductDetail extends Component{
    state={
        cName1: '',
        cName2: '',
    }

    async componentDidMount(){
        const {pCategoryId, categoryId}=this.props.location.state.product;
        if(pCategoryId==='0'){
            const result = await reqCategory(categoryId);
            const cName1=result.data.name;
            this.setState({cName1});
        }
        else{
            const results = await Promise.all(reqCategory(pCategoryId), reqCategory(categoryId))
            const cName1=results[0].data.name;
            const cName2=results[1].data.name;
            this.setState({cName1, cName2});
        }
    }
    render(){
        const title=(
            <span>
                <LinkButton>
                    <Icon 
                    type='arrow-left' 
                    style={{marginRight: '15px', fontSize: 20}}
                    onClick={()=>this.props.history.goBack()}/>                
                </LinkButton>

                <span>Details</span>
            </span>);

        const {name, desc, price, detail, imgs}=this.props.location.state.product;
        const {cName1, cName2}=this.state;

        return(
            <div>
                <Card title={title} className="productDetail">
                    <List bordered>
                        <Item>
                            <span className="left">Name: </span>
                            <span>{name}</span>
                        </Item>
                        <Item>
                            <span className="left">Description: </span>
                            <span>{desc}</span>
                        </Item>
                        <Item>
                            <span className="left">Price: </span>
                            <span>{price}</span>
                        </Item>
                        <Item>
                            <span className="left">Classification: </span>
                            <span>{cName1}{cName2 ? '-->'+cName2: ''}</span>
                        </Item>
                        <Item>
                            <span className="left">Picture: </span>
                            <span>{
                                imgs.map(item=>(
                                    <img 
                                    key={item}
                                    src={BASE_IMG_URL+item} 
                                    alt="img"
                                    className="image"/>                                    
                                ))} 
                            </span>
                        </Item>
                        <Item>
                            <span className="left">Details: </span>
                            <span dangerouslySetInnerHTML={{__html: detail}}>
                            </span>
                        </Item>
                    </List>
                </Card>
            </div>
        )
    }
}

