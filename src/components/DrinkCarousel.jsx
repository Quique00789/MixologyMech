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

    // Función para obtener el color según el nombre de la bebida
    const getDrinkTitleColor = (nombre) => {
        switch (nombre) {
            case 'Daiquiri':
                return 'rgba(75, 192, 192, 1)';
            case 'Gin Tonic':
                return 'rgba(153, 102, 255, 1)';
            case 'Black Russian':
                return 'rgba(255, 159, 64, 1)';
            case 'Cuba Libre':
                return 'rgba(226, 50, 50, 1)';
            case 'Margarita':
                return 'rgba(255, 206, 86, 1)';
            case 'Ice Tea':
                return 'rgba(54, 162, 235, 1)';
            default:
                return 'rgba(255, 255, 255, 1)'; // Color por defecto
        }
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
                <div key={pageIndex} className="carousel-page">
                    {group.map((drink, i) => {
                        const globalIndex = pageIndex * 5 + i + 1;
                        return (
                            <div key={i} className="drink-item">
                                <img src={getDrinkLogo(drink.nombre)} alt={drink.nombre} className="drink-logo" />
                                <h2
                                    className="drink-title"
                                    style={{ color: getDrinkTitleColor(drink.nombre) }}
                                >
                                    {`Bebida ${globalIndex}: ${drink.nombre}`}
                                </h2>
                                <p className="drink-detail">{`Consumo: ${drink.cantidad}`}</p>
                                <p className="drink-detail">{`Mesa: ${drink.mesa}`}</p>
                            </div>
                        );
                    })}
                </div>
            ))}
        </Carousel>
    );
};

export default DrinkCarousel;
