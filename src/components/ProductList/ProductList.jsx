import React, {useState} from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";
import {useCallback, useEffect} from "react";

const products = [
    {id: '1', title: 'Пельмени', price: 500, description: 'говядина/свинина Bolinhos 50/50 - carne bovina/porca', image: 'https://chopio.club/uploads/posts/2022-10/1664584361_1-beolin-club-p-gamburger-risunok-krasivo-2.jpg'},
    {id: '2', title: 'Вареники с картофелем', price: 120, description: 'Varéniki com batata', image: 'https://chopio.club/uploads/posts/2022-10/1664584361_1-beolin-club-p-gamburger-risunok-krasivo-2.jpg'},
    {id: '3', title: 'Блинчики с мясом', price: 50, description: 'Panquecas com carne', image: 'https://chopio.club/uploads/posts/2022-10/1664584361_1-beolin-club-p-gamburger-risunok-krasivo-2.jpg'},
    {id: '4', title: 'Котлеты', price: 122, description: ' говядина Costeletas de carne bovina', image: 'https://chopio.club/uploads/posts/2022-10/1664584361_1-beolin-club-p-gamburger-risunok-krasivo-2.jpg'},
    {id: '5', title: 'Паштеты', price: 50, description: 'Patê', image: 'https://chopio.club/uploads/posts/2022-10/1664584361_1-beolin-club-p-gamburger-risunok-krasivo-2.jpg'},
    {id: '6', title: 'Сырники', price: 60, description: '(печеные в духовке) Sirniki (assado no forno)', image: 'https://chopio.club/uploads/posts/2022-10/1664584361_1-beolin-club-p-gamburger-risunok-krasivo-2.jpg'},
    {id: '7', title: 'Мацони', price: 550, description: 'Matsoni', image: 'https://chopio.club/uploads/posts/2022-10/1664584361_1-beolin-club-p-gamburger-risunok-krasivo-2.jpg'},
    {id: '8', title: 'Штрудель', price: 120, description: 'Strudel', image: 'https://chopio.club/uploads/posts/2022-10/1664584361_1-beolin-club-p-gamburger-risunok-krasivo-2.jpg'},
]

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => {
        return acc += item.price
    }, 0)
}

const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const {tg, queryId} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
        fetch('https://https://3662-89-209-193-253.ngrok-free.app/web-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    }, [addedItems])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if(alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems)

        if(newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`
            })
        }
    }

    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                    product={item}
                    onAdd={onAdd}
                    className={'item'}
                />
            ))}
        </div>
    );
};

export default ProductList;
