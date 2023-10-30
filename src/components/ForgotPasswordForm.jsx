import React, { useState } from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonInput, IonButton, IonLabel, IonItem } from '@ionic/react';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { appSecondDB } from '../../firebaseUserConfig';

function ForgotPasswordForm({ onPasswordReset }) {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(''); // Para mostrar un mensaje al usuario

    const handleSubmit = async (e) => {
        e.preventDefault();
        const auth = getAuth(appSecondDB); // Asegurándose de que se use la instancia correcta de Firebase.

        // Validación del correo electrónico
        if (!email.trim()) {
            setMessage("Por favor, introduce un correo electrónico válido.");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Se ha enviado un enlace de restablecimiento a tu correo.');
            // Verifica si onPasswordReset existe y es una función antes de invocarla
            if (onPasswordReset && typeof onPasswordReset === 'function') {
                onPasswordReset(email);
            }
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                setMessage('El mail informado no es válido, por favor ingrese el correo nuevamente.');
            } else {
                setMessage(error.message);
            }
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Recuperar Contraseña</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <form onSubmit={handleSubmit}>
                    <IonItem>
                        <IonLabel position="floating">Ingresa tu correo electrónico:</IonLabel>
                        <IonInput 
                            type="email" 
                            value={email} 
                            onIonChange={(e) => setEmail(e.detail.value)} 
                            required 
                        />
                    </IonItem>
                    <div className="buttons-container">
                        <IonButton type="submit" expand="block">Enviar enlace de restablecimiento</IonButton>
                        <Link to="/">
                            <IonButton fill="outline" expand='block'>Cancelar</IonButton>
                        </Link>
                    </div>
                </form>
                {message && <p>{message}</p>} {/* Muestra el mensaje al usuario si existe */}
            </IonContent>
        </IonPage>
    );
}

export default ForgotPasswordForm;
