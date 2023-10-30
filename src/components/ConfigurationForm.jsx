import React, { useState, useRef } from 'react';
import { IonContent, IonPage, IonInput, IonButton, IonLabel, IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import pencilIcon from '../assets/pencil.png';
import { Link } from 'react-router-dom'; // Importa Link

function ConfigurationForm() {
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const history = useHistory();

    const nombreInputRef = useRef(null);
    const apellidoInputRef = useRef(null);
    const dniInputRef = useRef(null);
    const telefonoInputRef = useRef(null);
    const patenteInputRef = useRef(null);
    const passwordInputRef = useRef(null);

    const handleUnlock = (inputRef) => {
        if (inputRef.current) {
            inputRef.current.disabled = !inputRef.current.disabled;
            if (inputRef === passwordInputRef) {
                setShowRepeatPassword(true);
            }
        }
    };

    const handleCancel = () => {
        history.push('/principal');
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Configuración</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonLabel>
                    Nombre
                    <img src={pencilIcon} alt="Editar" onClick={() => handleUnlock(nombreInputRef)} />
                </IonLabel>
                <IonInput ref={nombreInputRef} type="text" placeholder="Nombre" disabled={true} />

                <IonLabel>
                    Apellido
                    <img src={pencilIcon} alt="Editar" onClick={() => handleUnlock(apellidoInputRef)} />
                </IonLabel>
                <IonInput ref={apellidoInputRef} type="text" placeholder="Apellido" disabled={true} />

                <IonLabel>
                    DNI
                    <img src={pencilIcon} alt="Editar" onClick={() => handleUnlock(dniInputRef)} />
                </IonLabel>
                <IonInput ref={dniInputRef} type="text" placeholder="DNI" disabled={true} />

                <IonLabel>
                    Teléfono
                    <img src={pencilIcon} alt="Editar" onClick={() => handleUnlock(telefonoInputRef)} />
                </IonLabel>
                <IonInput ref={telefonoInputRef} type="tel" placeholder="Teléfono" disabled={true} />

                <IonLabel>
                    Patente
                    <img src={pencilIcon} alt="Editar" onClick={() => handleUnlock(patenteInputRef)} />
                </IonLabel>
                <IonInput ref={patenteInputRef} type="text" placeholder="Patente" disabled={true} />

                <IonLabel>Correo Electrónico</IonLabel>
                <IonInput type="email" placeholder="Correo electrónico" disabled={true} />

                <IonLabel>
                    Contraseña
                    <img src={pencilIcon} alt="Editar" onClick={() => handleUnlock(passwordInputRef)} />
                </IonLabel>
                <IonInput ref={passwordInputRef} type="password" placeholder="Contraseña" disabled={true} />

                {showRepeatPassword && (
                    <>
                        <IonLabel>Repetir Contraseña *</IonLabel>
                        <IonInput type="password" placeholder="Repetir Contraseña" required />
                    </>
                )}

                <div className="buttons-container">
                    <IonButton expand="block" type="submit">Guardar Cambios</IonButton>
                    <IonButton expand="block" type="submit" onClick={handleCancel}>Cancelar</IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
}

export default ConfigurationForm;
