import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebaseConfig';
import './DrinkCarousel.css';

const DrinkCarousel = () => {
    const [drinks, setDrinks] = useState([]);

    useEffect(() => {
        const dbRef = ref(database, 'bebidas');

        const unsubscribe = onValue(dbRef, (snapshot) => {
            if (snapshot.exists()) {
                const rawData = snapshot.val();
                const bebidaList = Object.keys(rawData).map(key => ({
                    clave: key,
                    ...rawData[key],
                }));
                setDrinks(bebidaList);
            }
        });

        return () => unsubscribe();
    }, []);

    // Función para obtener el path del logo basado en el nombre de la bebida
    const getDrinkLogo = (drinkName) => {
        const normalizedDrinkName = drinkName.toLowerCase().replace(/\s+/g, '');
        return require(`../drinkLogos/${normalizedDrinkName}.png`);
    };

    const groupedDrinks = [];
    for (let i = 0; i < drinks.length; i += 5) {
        groupedDrinks.push(drinks.slice(i, i + 5));
    }

    return (
        <Carousel
            showArrows={true}
            emulateTouch={true}
            useKeyboardArrows={true}
            infiniteLoop={true}
            showThumbs={false}
            showStatus={false}
            autoPlay={false}
            swipeable={true}
        >
            {groupedDrinks.map((group, pageIndex) => (
                <div key={pageIndex} style={{ display: 'flex', justifyContent: 'center' }}>
                    {group.map((drink, i) => {
                        const globalIndex = pageIndex * 5 + i + 1;
                        return (
                            <div key={i} style={{ margin: '0 10px', textAlign: 'center' }}>
                                <img src={getDrinkLogo(drink.nombre)} alt={drink.nombre} className="drink-logo" />
                                <h2>{`Bebida ${globalIndex}: ${drink.nombre}`}</h2>
                                <p>{`Consumo: ${drink.cantidad}`}</p>
                                <p>{`Mesa: ${drink.mesa}`}</p>
                            </div>
                        );
                    })}
                </div>
            ))}
        </Carousel>
    );
};

export default DrinkCarousel;
