import React from 'react';
import {
    IonButton,
    IonInput,
    IonLabel,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonGrid,
    IonRow,
    IonCol
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Tarifas = () => {
    const tarifas = [
        { duracion: '5 minutos', precio: 100 },
        { duracion: '1 hora', precio: 900 },
        { duracion: '12 horas', precio: 3300 },
        { duracion: '24 horas', precio: 4500 }
    ];

    const [tiempo, setTiempo] = React.useState("");
    const [resultado, setResultado] = React.useState(null);

    function calcularCosto() {
        function calcularCosto() {
            const [horas, minutos] = tiempo.split(":").map(item => parseInt(item));
        
            if (isNaN(horas) || isNaN(minutos) || minutos > 59) {
                alert("Por favor, ingrese un formato de tiempo válido.");
                return;
            }
        
            let costo = 0;
        
            // 1. Si el usuario ingresa entre 5 minutos y 30 minutos
            if (horas === 0 && minutos > 0 && minutos <= 30) {
                costo += Math.ceil(minutos / 5) * tarifas[0].precio;
            } else {
                // 2. Si el usuario ingresa más de 30 minutos
                costo += (horas * tarifas[1].precio) + (minutos / 60) * tarifas[1].precio;
        
                // 3. Si el cálculo es menor a 12 horas y supera el precio de la estadia de 12 horas
                if (horas < 12 && costo > tarifas[2].precio) {
                    costo = tarifas[2].precio;
                }
        
                // 4. Si son 12 horas exactas
                if (horas === 12 && minutos === 0) {
                    costo = tarifas[2].precio;
                }
        
                // 5. Si se pasan las 12 horas
                if (horas > 12 && horas < 24) {
                    costo = tarifas[2].precio + (horas - 12) * tarifas[1].precio + (minutos / 60) * tarifas[1].precio;
                }
        
                // 6. Si el precio supera el valor de la estadia de 24 horas pero no se superan las 24 horas
                if (horas === 24 && minutos === 0) {
                    costo = tarifas[3].precio;
                } else if (horas > 24) {
                    // 7. En caso de que se superen las 24 horas
                    const periodosCompletos24h = Math.floor(horas / 24);
                    const horasRestantes = horas % 24;
        
                    costo = periodosCompletos24h * tarifas[3].precio;
        
                    // 8. Repetir el cálculo para periodos completos de 24 horas
                    if (horasRestantes < 12) {
                        costo += horasRestantes * tarifas[1].precio + (minutos / 60) * tarifas[1].precio;
                    } else if (horasRestantes >= 12) {
                        costo += tarifas[2].precio + (horasRestantes - 12) * tarifas[1].precio + (minutos / 60) * tarifas[1].precio;
                    }
                }
            }
        
            setResultado(costo);
        }
        
    }

    let history = useHistory();

    const navigateToMain = () => {
        history.push('/principal');
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Tarifas de Estacionamiento</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <IonLabel>Duración</IonLabel>
                        </IonCol>
                        <IonCol>
                            <IonLabel>Precio (Pesos)</IonLabel>
                        </IonCol>
                    </IonRow>
                    {tarifas.map((tarifa, index) => (
                        <IonRow key={index}>
                            <IonCol>{tarifa.duracion}</IonCol>
                            <IonCol>{tarifa.precio}</IonCol>
                        </IonRow>
                    ))}
                </IonGrid>

                <div className="calculator-container">
                    <IonInput
                        type="time"
                        value={tiempo}
                        onIonChange={(e) => setTiempo(e.target.value)}
                        placeholder="hh:mm"
                    />
                    <IonButton expand="full" onClick={calcularCosto}>Calcular</IonButton>
                    {resultado !== null && <p>Costo estimado: ${resultado} pesos</p>}
                </div>

                <div className="buttons-container">
                    <IonButton expand="full" onClick={navigateToMain}>Volver</IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
}

export default Tarifas;
