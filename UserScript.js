import fs from 'fs';

// Estructura de datos
const userData = {
    apellido: "",
    correoelectronico: "",
    DNI: 0,
    nombre: "",
    patente: "",
    rol: false, // false para usuario normal, true para administrador
    telefono: 0,
    reservas: {cochera:"",fecha:"",estado:""}, // Subcolección
    pagos: {}, // Subcolección
    estacionamientos: {} // Subcolección
};

// Guardar la estructura en un archivo JSON
fs.writeFile('users.json', JSON.stringify(userData, null, 2), (err) => {
    if (err) {
        console.error("Error al escribir el archivo JSON:", err);
    } else {
        console.log("Archivo JSON generado con éxito.");
    }
});
