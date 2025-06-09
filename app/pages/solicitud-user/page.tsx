'use client';
import React, { useState } from 'react';
import '@/app/globals.css';
import { SiteLayout } from '@/components/site-layout';
import CreateSolicitude from '@/app/models/Solicitud';
import Solicitud from '@/app/Services/solicitudService';
import CreateDetalleError from '@/app/models/DetalleError';
import FirebaseService from '@/app/Services/firebase/FirebaseService';
import StorageNavegador from '@/app/Services/StorageNavegador';
import User from '@/app/models/User';
import DatosSolicitante from '@/components/FormularioSolicitud/DatosSolicitante';
import DatosAplicacion from '@/components/FormularioSolicitud/DatosAplicacion';
import DescripcionCambio from '@/components/FormularioSolicitud/DescripcionCambio';
import DetalleError from '@/components/FormularioSolicitud/DetalleError';

export default function SolicitudCambioForm() {
  const user = StorageNavegador.getItemWithExpiry("user") as User;
  const token = user?.token;

  const [archivoFile, setArchivoFile] = useState<File | null>(null);
  const handleArchivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArchivoFile(file);
    }
  };


  const [solicitudData, setSolicitudData] = useState<CreateSolicitude>({
    idUser: 'GCyfxJs1plZ19ILC2FdcATPTVyf1',
    apartado: '',
    tipoCambio: '',
    otroTipo: '',
    descripcion: '',
    justificacion: '',
    urgencia: '',
    archivo: '',
  });

  const [detalleErrorData, setDetalleErrorData] = useState<CreateDetalleError>({
    idSolicitud: 0,
    pasosReproduccion: '',
    resultadoEsperado: '',
    resultadoObservado: '',
    fechaIncidente: new Date(),
    frecuenciaError: '',
    mensajeError: '',
    sistemaNavegador: '',
    urlError: '',
    workaround: '',
  });

  const handleChangeSolicitud = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const files = (e.target as HTMLInputElement).files;

    if (type === 'file' && files && files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setSolicitudData((prev) => ({
          ...prev,
          [name]: reader.result as string,
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setSolicitudData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleChangeDetalle = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setDetalleErrorData((prev) => ({
      ...prev,
      [name]: type === "datetime-local" ? new Date(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let urlArchivo;
      if (archivoFile) {
        urlArchivo = await FirebaseService.uploadFile(archivoFile, "alexander", archivoFile.name);
      }
      solicitudData.archivo = urlArchivo ?? "";
      const solicitudCreada = await Solicitud.crearSolicitud(solicitudData);

      if (solicitudData.tipoCambio === 'Corrección de error') {
        await Solicitud.crearDetalleError({
          ...detalleErrorData,
          idSolicitud: solicitudCreada.idSolicitud,
        });
      }

      alert('Solicitud enviada correctamente');
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      alert('Error al enviar la solicitud');
    }
  };

  return (
    <SiteLayout>      <div className="max-w-4xl mx-auto p-6 bg-card rounded-2xl shadow-md border">
      <h1 className="text-3xl font-bold text-primary mb-6 text-center">Formulario de Solicitud de Cambio</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Datos del Solicitante */}
        <DatosSolicitante user={user} />



        {/* Datos de la Aplicación */}
        <DatosAplicacion
          value={solicitudData.apartado}
          onChange={handleChangeSolicitud}
        />

        {/* Descripción del Cambio Solicitado */}
        <DescripcionCambio
          tipoCambio={solicitudData.tipoCambio}
          otroTipo={solicitudData.otroTipo}
          descripcion={solicitudData.descripcion}
          onChange={handleChangeSolicitud}
        />


        {/* Campos de error si aplica */}
        <DetalleError
          visible={solicitudData.tipoCambio === "Corrección de error"}
          detalleError={detalleErrorData}
          onChange={handleChangeDetalle}
        />

        {/* Justificación del Cambio */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-primary dark:text-white">Justificación del Cambio</h2>
          <textarea
            name="justificacion"
            placeholder="¿Por qué se necesita este cambio? ¿Qué problema resuelve o qué mejora aporta?"
            onChange={handleChangeSolicitud}
            value={solicitudData.justificacion}
            className="w-full p-3 border rounded-lg bg-background auth-input min-h-[120px]"
          />
        </div>

        {/* Urgencia */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-primary dark:text-white">Urgencia del Cambio</h2>
          <select
            name="urgencia"
            onChange={handleChangeSolicitud}
            value={solicitudData.urgencia}
            className="w-full p-3 border rounded-lg bg-background auth-input"
          >
            <option value="">Seleccione una opción</option>
            <option value="Alta">Alta (bloquea operaciones / afecta a muchos usuarios)</option>
            <option value="Media">Media (impacto moderado / solución alternativa posible)</option>
            <option value="Baja">Baja (mejora menor / no urgente)</option>
          </select>
        </div>

        {/* Adjuntar Archivos */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-primary dark:text-white">Adjuntar Archivos</h2>
          <div className="flex flex-col items-start space-y-2">
            <label
              htmlFor="archivoInput"
              className="inline-flex items-center justify-center px-6 py-2 auth-button text-white font-medium rounded-lg cursor-pointer transition-all"
            >
              Seleccionar archivo
            </label>

            <input
              id="archivoInput"
              type="file"
              accept=".png,.jpg,.jpeg,.pdf,.docx,.xlsx"
              onChange={handleArchivoChange}
              className="hidden"
            />

            {archivoFile && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Archivo seleccionado: <span className="font-medium">{archivoFile.name}</span>
              </p>
            )}
          </div>
        </div>


        <button
          type="submit"
          className="w-full py-3 auth-button text-white font-semibold rounded-lg transition-all"
        >
          Enviar Solicitud
        </button>
      </form>
    </div >
    </SiteLayout >
  );
}