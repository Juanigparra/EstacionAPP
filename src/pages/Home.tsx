import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonInput,
    IonButton,
    IonLabel,
    IonItem,
    IonAlert
} from '@ionic/react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { appSecondDB } from '../../firebaseUserConfig';  // Asegúrate de ajustar la ruta según donde se encuentra tu archivo

const auth = getAuth(appSecondDB);

const Home: React.FC = () => {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            history.push('/principal');
        } catch (error:any) {
            setErrorMessage("Credenciales Invalidas, Ingreselas Nuevamente.");
            setShowError(true);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>EstacionApp</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <form>
                    <IonItem>
                        <IonLabel position="floating">Correo Electrónico</IonLabel>
                        <IonInput type="email" value={email} onIonChange={e => setEmail(e.detail.value!)} />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Contraseña</IonLabel>
                        <IonInput type="password" value={password} onIonChange={e => setPassword(e.detail.value!)} />
                    </IonItem>
                    <IonButton expand="block" type="button" onClick={handleLogin}>Iniciar sesión</IonButton>
                </form>
                <Link to="/forgot-password">
                    <IonButton fill="clear" expand="block">Olvidé mi contraseña</IonButton>
                </Link>
                <Link to="/register">
                    <IonButton fill="clear" expand="block">Registrarme</IonButton>
                </Link>

                <IonAlert
                    isOpen={showError}
                    onDidDismiss={() => setShowError(false)}
                    header={'Error'}
                    message={errorMessage}
                    buttons={['OK']}
                />
            </IonContent>
        </IonPage>
    );
}

export default Home;
