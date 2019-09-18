import React, {useState} from 'react';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls.js';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders';
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

const BurgerBuilder = () => {
    const basePrice = 4;
    const [ingredients, setIngredients] = useState({});
    const [price, setPrice] = useState(basePrice);
    const [purchasable, setPurchasable] = useState(false);
    const [purchasing, setPurchasing] = useState(false);
    const [loading, setLoading] = useState(false);

    const updatePurchaseState = newIngredients => {
        const ingredientsCount = Object.keys(newIngredients)
            .map(key => newIngredients[key])
            .reduce((a, b) => a + b, 0);
        setPurchasable(ingredientsCount > 0);
    };

    const addIngredientHandler = type => {
        const oldCount = ingredients[type] ? ingredients[type] : 0;
        const stateCopy = {...ingredients};
        stateCopy[type] = oldCount + 1;
        setIngredients(stateCopy);
        setPrice(price + INGREDIENT_PRICES[type]);
        updatePurchaseState(stateCopy);
    };

    const removeIngredientHandler = type => {
        const oldCount = ingredients[type] ? ingredients[type] : 0;
        const newCount = oldCount - 1 > 0 ? oldCount - 1 : 0;
        const stateCopy = {...ingredients};
        if (newCount === 0) {
            delete stateCopy[type];
        } else {
            stateCopy[type] = newCount;
        }
        setIngredients(stateCopy);
        if (oldCount !== newCount) {
            let newPrice = price - INGREDIENT_PRICES[type];
            if (newPrice < basePrice) {
                newPrice = basePrice;
            }
            setPrice(newPrice);
        }
        updatePurchaseState(stateCopy);
    };

    const purchaseContinueHandler = () => {
        setLoading(true);
        const order = {
            ingredients,
            price,
            customer: {
                lastName: 'Müller',
                street: 'Neuer Jungfernstieg 20',
                city: 'Hamburg'
            },
            deliveryTime: 'fastest'
        };
        axios.post('/orders', order)
            .then(console.log)
            .catch(console.log)
            .finally(() => {
                setLoading(false);
                setPurchasing(false);
            });
    };
    let orderSummery = <OrderSummary ingredients={ingredients}
                                     price={price}
                                     purchaseCanceled={() => setPurchasing(false)}
                                     purchaseContinued={purchaseContinueHandler}/>;
    if (loading) {
        orderSummery = <Spinner/>
    }

    return (
        <>
            <Modal show={purchasing} modalClosed={() => setPurchasing(false)}>
                {orderSummery}
            </Modal>
            <Burger ingredients={ingredients}/>
            <BuildControls
                price={price}
                ingredients={ingredients}
                ingredientAdded={addIngredientHandler}
                ingredientRemove={removeIngredientHandler}
                purchasable={purchasable}
                ordered={() => setPurchasing(true)}
            />
        </>
    );
};

export default withErrorHandler(BurgerBuilder, axios);