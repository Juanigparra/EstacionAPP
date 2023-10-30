import React, { useState, useEffect, useRef  } from 'react';
import {
    IonButton, IonCard, IonCardContent, IonLabel, IonModal, IonHeader, IonToolbar,
    IonTitle, IonContent, IonPage, IonText, IonAlert, IonToast
} from '@ionic/react';
import { getDatabase, ref, onValue, set, push, update } from 'firebase/database';
import { app } from '../../firebaseConfig';
import { appSecondDB } from '../../firebaseUserConfig'; // Base de datos de usuarios
import { getAuth } from 'firebase/auth';

const ListaCocheras = () => {
    const [cocheras, setCocheras] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const cocherasPerPage = 10;
    const [selectedCochera, setSelectedCochera] = useState(null);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [timer, setTimer] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [currentReservaKey, setCurrentReservaKey] = useState(null);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [lastReserva, setLastReserva] = useState(null);
    const [blockBooking, setBlockBooking] = useState(false);
    const [remainingTime, setRemainingTime] = useState( 0.1 * 60); // 30 minutos en segundos
    const [totalBlockTime, setTotalBlockTime] = useState(0.2 * 60); // 10 minutos


    const auth = getAuth(appSecondDB);
    const user = auth.currentUser;
    const timerIntervalRef = useRef(null);
///////////////////////////////////////////
///////////////////////////////////////////

    let userId;
    if (user) {
        userId = user.uid;
        console.log("UID del usuario:", userId);
    } else {
        console.log("No hay usuario autenticado");
    }
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (userId) {
            const db = getDatabase(appSecondDB);
            const reservaRef = ref(db, `usuario/${userId}/reservas`);
          
            // Establece un oyente para detectar cambios en los datos del usuario
            const unsubscribe = onValue(reservaRef, (snapshot) => {
                const reservas = snapshot.val();
                if (reservas) {
                    const lastKey = Object.keys(reservas).sort().reverse()[0];
                    const lastReservaData = { ...reservas[lastKey], key: lastKey }; // Aquí añadimos la propiedad key
                    setLastReserva(lastReservaData);
                }
            });
          
            // Desmonta el oyente cuando el componente se desmonte
            return () => {
                unsubscribe();
            };
        }
    }, [userId]);  // Dependencia en userId para volver a ejecutarse si cambia


    //LOGICA  ESTADOS
    useEffect(() => {
      
        console.log("lastReserva ha cambiado:", lastReserva);
        
        if (lastReserva && (lastReserva.estado === 'Cancelada.' || lastReserva.estado === 'Expirada.')) {
            setBlockBooking(true);
    
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
    
            timerIntervalRef.current = setInterval(() => {
                setRemainingTime(prev => {
                    if (prev <= 0) {
                        clearInterval(timerIntervalRef.current);
                        setBlockBooking(false);
    
                        return 0.1 * 60; // Reinicia el temporizador para la próxima vez
                    }
                    return prev - 1;
                });
                    const { key, ...reservaWithoutKey } = lastReserva;

                if (remainingTime <= 1) {  // En lugar de preguntar por 0, usamos 1 debido a la naturaleza asincrónica del setRemainingTime.
                    const db = getDatabase(appSecondDB); 
                    console.log('Valor de lastReserva.key:', lastReserva.key);
                    const reservaToUpdateRef = ref(db, `usuario/${userId}/reservas/${lastReserva.key}`);
                    
                    const { key, ...reservaWithoutKey } = lastReserva;


                    if (lastReserva.estado === 'Cancelada.') {
                        update(reservaToUpdateRef, {
                            ...reservaWithoutKey,
                            estado: 'Cancelada'
                        });
                    } else if (lastReserva.estado === 'Expirada.') {
                        update(reservaToUpdateRef, {
                            ...reservaWithoutKey,
                            estado: 'Expirada'
                        });
                    }
                }
            }, 1000);
        }
    }, [lastReserva, remainingTime]);

    
    
///////////////////////////////////////////
///////////////////////////////////////////
useEffect(() => {
    const blockEndTime = localStorage.getItem('blockEndTime');

    if (blockEndTime) {
        const now = Date.now();
        const remainingSeconds = (blockEndTime - now) / 1000;
        if (remainingSeconds > 0) {
            setRemainingTime(remainingSeconds);
            setBlockBooking(true);
        } else {
            console.log("El tiempo de bloqueo ha expirado");
        }
    }
}, []);


useEffect(() => {
    if (blockBooking) {
        const interval = setInterval(() => {
            setRemainingTime(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(interval);
                    setBlockBooking(false);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }
}, [blockBooking]);




///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////

    useEffect(() => {
        const db = getDatabase(app);
        const cocherasRef = ref(db, '/');

        onValue(cocherasRef, (snapshot) => {
            const data = snapshot.val();
            const lista = [];
            for (let id in data) {
                lista.push({ ...data[id], key: id });
            }
            setCocheras(lista);
        });
    }, []);

    useEffect(() => {
        if (timer === 0) {
            const db = getDatabase(app);
            const cocheraRef = ref(db, `/${selectedCochera.key}`);
            set(cocheraRef, { ...selectedCochera, estado: 'disponible', sensor: { ...selectedCochera.sensor, colorLed: 'verde' } });
            setCocheras(prevCocheras => {
                return prevCocheras.map(cochera => {
                    if (cochera.id === selectedCochera.id) {
                        return { ...cochera, estado: 'disponible' };
                    }
                    return cochera;
                });
            });
            setSelectedCochera(null); // Limpiamos la cochera seleccionada
            setTimer(null);
        }
    }, [timer]);


    const handleReserve = (cochera) => {
        setSelectedCochera(cochera);
        setShowConfirmPopup(true);
    };

    const obtenerFechaActual = () => {
        const fecha = new Date();
        return `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
    };

    const generateUniqueCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    const confirmReservation = () => {

        const db = getDatabase(app);
        const cocheraRef = ref(db, `/${selectedCochera.key}`);
        set(cocheraRef, { 
            ...selectedCochera, 
            estado: 'reservado', 
            sensor: { 
                ...selectedCochera.sensor, 
                colorLed: 'amarillo' 
            } 
        });

        setTimer(10); // 10 minutos en segundos

        timerIntervalRef.current = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    // Actualizar el estado en la base de datos
                    const dbu = getDatabase(appSecondDB);
                    const reservaToUpdateRef = ref(dbu, `usuario/${userId}/reservas/${newReservaRef.key}`);
                    update(reservaToUpdateRef, {
                        estado: 'Expirada.'
                    });
    
                    // Limpieza: detener el intervalo y devolver 0 para el temporizador.
                    clearInterval(timerIntervalRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        setTimeout(() => {
            clearInterval(timerIntervalRef.current);
        }, 10000); // 10 minutos

        setShowConfirmPopup(false);
        
        const uniqueReservationCode = generateUniqueCode();
        const dbu = getDatabase(appSecondDB); // Usamos la segunda instancia de Firebase
        const reservasRef = ref(dbu, `usuario/${userId}/reservas`);
        const newReservaRef = push(reservasRef); 
        set(newReservaRef, {
            cochera: selectedCochera.id,
            fecha: obtenerFechaActual(),
            estado: 'Activa',
            codigoreserva: uniqueReservationCode,
        });
        setCurrentReservaKey(newReservaRef.key);
       
    };

    const cancelarReserva = async () => {
        // Ocultar el IonAler


        const dbu = getDatabase(appSecondDB);
        const reservaToUpdateRef = ref(dbu, `usuario/${userId}/reservas/${currentReservaKey}`);
        const db = getDatabase(app);
        const cocheraRef = ref(db, `/${selectedCochera.key}`);
    
        
        try {
          // Actualizamos el estado de la reserva a 'Cancelada'
          await update(reservaToUpdateRef, {
            estado: 'Cancelada.'
          });
        
          await set(cocheraRef, { ...selectedCochera, estado: 'disponible', sensor: { ...selectedCochera.sensor, colorLed: 'verde' } });
      

                // Actualiza la lista de cocheras en el estado del componente
        setCocheras(prevCocheras => {
            return prevCocheras.map(cochera => {
                if (cochera.id === selectedCochera.id) {
                 return { ...cochera, estado: 'disponible' };
                }
                return cochera;
        });
     });

        // Limpiamos la cochera seleccionada y el temporizador
        setSelectedCochera(null);
        setTimer(null);

        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }
          // Actualiza el estado del componente o redirecciona al usuario como lo requieras
          setShowCancelConfirm(true);
          
        } catch (error) {
          console.error("Error al cancelar la reserva:", error);
          // Muestra un mensaje de error al usuario si es necesario
        }
    }
//LOGICAS NUEVAS
  // Agregamos remainingTime a las dependencias



    const cocherasFiltradas = cocheras.filter(cochera => cochera.estado === "disponible");
    const lastCocheraIndex = currentPage * cocherasPerPage;
    const firstCocheraIndex = lastCocheraIndex - cocherasPerPage;
    const currentCocheras = cocherasFiltradas.slice(firstCocheraIndex, lastCocheraIndex);
    const totalPages = Math.ceil(cocherasFiltradas.length / cocherasPerPage);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Cocheras Disponibles</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
            <IonToast
                isOpen={blockBooking}
                message="No puede realizar una reserva debido a que su última reserva expiró o fue cancelada. Podrá volver a realizar una reserva pasado los 30 minutos."
                duration={5000}
            />

                {timer === null ? (
                    <>
                        {currentCocheras.map((cochera, index) => (
                            <IonCard key={index}>
                                <IonCardContent>
                                    <IonLabel>{cochera.id}</IonLabel>
                                    <IonButton expand="full" onClick={() => handleReserve(cochera)} disabled={blockBooking}>Reservar</IonButton>
                                </IonCardContent>
                            </IonCard>
                        ))}
                        <div className="pagination">
                            {[...Array(totalPages)].map((_, index) => (
                                <IonButton fill="outline" key={index} onClick={() => setCurrentPage(index + 1)}>
                                    {index + 1}
                                </IonButton>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="reserved-area">
                        <IonText>Has reservado la cochera: {selectedCochera?.id}</IonText>
                        <div className="timer">
                            Tiempo restante de la reserva: {Math.floor(timer / 60)}:{timer % 60 < 10 ? '0' : ''}{timer % 60} minutos
                        </div>
                    </div>
                )}
                <IonModal isOpen={showConfirmPopup}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Confirmar Reserva</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <p>¿Desea iniciar la reserva?</p>
                        <IonButton expand="full" onClick={confirmReservation}>Aceptar</IonButton>
                        <IonButton expand="full" color="danger" onClick={() => setShowConfirmPopup(false)}>Cancelar</IonButton>
                    </IonContent>
                </IonModal>
                {timer && selectedCochera ? (
                    <IonButton expand="block" onClick={() => setShowAlert(true)}>
                            Cancelar reserva
                    </IonButton>
                    ) : null
                }
                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    header={'¿Desea cancelar la reserva?'}
                    message={'Si cancela la reserva no podrá volver a reservar una cochera por los proximos 30 minutos.'}
                    buttons={[
                        {
                        text: 'Cancelar',
                        role: 'cancel',
                        cssClass: 'secondary',

                        },
                        {
                        text: 'Aceptar',
                        handler: cancelarReserva
                        }
                    ]}
                />
                <IonAlert
                    isOpen={showCancelConfirm}
                    onDidDismiss={() => {
                    setShowCancelConfirm(false);
                    // Aquí puedes redirigir al usuario a la página de cocheras disponibles.
                    // Por ejemplo: history.push('/ruta-de-tu-pagina-de-cocheras');
                    }}
                            header={'Reserva Cancelada'}
                            message={'La reserva ha sido cancelada con éxito.'}
                            buttons={[
                                {
                                    text: 'Aceptar',
                                    handler: () => {
                                         // Aquí puedes hacer cualquier otra acción adicional si lo deseas.
                                    }
                                }
                            ]}
                />
                    {blockBooking && (
                        <div>
                            Podra realizar una nueva reserva en: {Math.floor(remainingTime / 60)}:{String(Math.round(remainingTime % 60)).padStart(2, '0')}
                        </div>
                    )}

            </IonContent>
        </IonPage>
    );
};

export default ListaCocheras;
