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
import { getDatabase, ref, push, set } from 'firebase/database';
import { appSecondDB } from '../../firebaseUserConfig';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from '@firebase/auth';


function RegisterForm() {
    const history = useHistory();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const handleRegister = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        // Obtener los valores del formulario
        const nombre = e.target.elements[0].value;
        const apellido = e.target.elements[1].value;
        const dni = e.target.elements[2].value;
        const telefono = e.target.elements[3].value;
        const patente = e.target.elements[4].value;
        const correo = e.target.elements[5].value;
        const password = e.target.elements[6].value;
        const repeatPassword = e.target.elements[7].value;

        if (password !== repeatPassword) {
            setErrorMessage("Las contraseñas no coinciden.");
            return;
        } else {
            setErrorMessage("");
        }

        try {
            // Comentado: Registrar el usuario en Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, correo, password);
            const user = userCredential.user;
            const userId = user.uid;
            // Comentado: Enviar correo de verificación
            await sendEmailVerification(user);


            // Guardar información adicional del usuario en la base de datos
            await saveUserDataToDatabase(userId, nombre, apellido, dni, telefono, patente, correo);


            setIsSubmitted(true); // Indica que el correo ha sido enviado
            setShowPopup(true); // Muestra el popup
        } catch (error) {
            alert(error.message);
        }
    };
    const saveUserDataToDatabase = async (userId, nombre, apellido, dni, telefono, patente, correo) => {
        const db = getDatabase(appSecondDB);
        const newUserRef = ref(db, `usuario/${userId}`);
        const newUser = push(newUserRef);
        const userData = {
            id: userId,
            apellido: apellido,
            correoelectronico: correo,
            DNI: dni,
            nombre: nombre,
            patente: patente,
            rol: false,
            telefono: telefono,
            reservas: {cochera:"",fecha:"",estado:""},
            pagos: {},
            estacionamientos: {}
        };
        await set(newUser, userData);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Registro</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <form onSubmit={handleRegister}>
                    <IonItem>
                        <IonLabel position="floating">Nombre</IonLabel>
                        <IonInput type="text" required />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Apellido</IonLabel>
                        <IonInput type="text" required />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">DNI</IonLabel>
                        <IonInput type="text" required />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Teléfono</IonLabel>
                        <IonInput type="tel" required />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Patente</IonLabel>
                        <IonInput type="text" required />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Correo Electrónico</IonLabel>
                        <IonInput type="email" required />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Contraseña</IonLabel>
                        <IonInput type="password" required />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Repetir Contraseña</IonLabel>
                        <IonInput type="password" required />
                    </IonItem>
                    {errorMessage && <IonLabel color="danger">{errorMessage}</IonLabel>}
                    <IonButton expand="block" type="submit">Registrarse</IonButton>
                </form>
                <Link to="/">
                    <IonButton fill="clear" expand="block">Volver</IonButton>
                </Link>
                <IonAlert
                    isOpen={isSubmitted}
                    onDidDismiss={() => setIsSubmitted(false)}
                    header={'¡Correo enviado!'}
                    message={'Se ha enviado el correo a la casilla indicada. Por favor verifique su email.'}
                    buttons={['Finalizar']}
                />
            </IonContent>
        </IonPage>
    );
}

export default RegisterForm;
