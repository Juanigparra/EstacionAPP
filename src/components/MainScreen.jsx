import React from 'react';
import {
  IonContent,
  IonHeader,
  IonItem,
  IonMenu,
  IonMenuToggle,
  IonPage,
  IonTitle,
  IonToolbar,
  IonMenuButton
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

function MainScreen() {
  const history = useHistory();

  const handleMenuItemClick = (path) => {
    history.push(path);
  };

  return (
    <>
      <IonMenu side="start" contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menú</IonTitle>
            <IonMenuButton slot="end" autoHide={false} />
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonMenuToggle>
            <IonItem button onClick={() => handleMenuItemClick('/cochera')}>
              Ver cocheras disponibles
            </IonItem>
            <IonItem button onClick={() => handleMenuItemClick('/mis-reservas')}>
              Mis reservas
            </IonItem>
            <IonItem button onClick={() => handleMenuItemClick('/mis-estacionamientos')}>
              Mis estacionamientos
            </IonItem>
            <IonItem button onClick={() => handleMenuItemClick('/mis-pagos')}>
              Mis pagos
            </IonItem>
            <IonItem button onClick={() => handleMenuItemClick('/tarifa')}>
              Tarifas
            </IonItem>
            <IonItem button onClick={() => handleMenuItemClick('/configuracion')}>
              Configuración
            </IonItem>
            <IonItem button onClick={() => handleMenuItemClick('/home')}>
              Cerrar sesión
            </IonItem>
          </IonMenuToggle>
        </IonContent>
      </IonMenu>

      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonMenuButton slot="start" autoHide={false} />
            <IonTitle>EstacionApp</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {/* El contenido de tu pantalla principal */}
        </IonContent>
      </IonPage>
    </>
  );
}

export default MainScreen;
