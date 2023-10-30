import { getDatabase, ref, onValue, update } from 'firebase/database';
import { app } from './firebaseConfig.js';

const db = getDatabase(app);

const simulateDistanceSensor = () => {
    return Math.floor(Math.random() * 100);
};

const updateRandomCocheraDistance = () => {
    const cocherasRef = ref(db, '/');

    onValue(cocherasRef, (snapshot) => {
        const cocheras = snapshot.val();
        const cocheraKeys = Object.keys(cocheras);

        const randomCocheraKey = cocheraKeys[Math.floor(Math.random() * cocheraKeys.length)];
        const selectedCochera = cocheras[randomCocheraKey];

        if (selectedCochera.estado !== 'reservado') {
            const newDistance = simulateDistanceSensor();
            let newEstado = '';
            let newColor = '';

            if (newDistance <= 50) {
                newEstado = 'ocupado';
                newColor = 'rojo';
            } else {
                newEstado = 'disponible';
                newColor = 'verde';
            }

            const updateRef = ref(db, `/${randomCocheraKey}`);
            update(updateRef, {
                estado: newEstado,
                sensor: {
                    distancia: newDistance,
                    colorLed: newColor
                }
            });

            console.log(`Actualizada la cochera con ID: ${randomCocheraKey} a una distancia de: ${newDistance} metros, estado: ${newEstado}, color LED: ${newColor}.`);
        } else {
            console.log(`La cochera con ID: ${randomCocheraKey} está reservada. No se actualizó.`);
        }
    });
};

setInterval(updateRandomCocheraDistance, 10000);
