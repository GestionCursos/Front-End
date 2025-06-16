'use client';
import User from '@/app/models/User';
import React from 'react';

interface Props {
  user: User | null;
}

const inputStyle =
  "w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white cursor-not-allowed";

export default function DatosSolicitante({ user }: Props) {
  const defaultUser = {
    username: "Anónimo",
    email: "anonimo@gmail.com",
    rol: "Usuario",
  };

  const currentUser = user ?? defaultUser;

  return (
    <div className="space-y-6 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-primary dark:text-white">Datos del Solicitante</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nombre completo
          </label>
          <input id="nombre" name="nombre" type="text" className={inputStyle} value={currentUser.username} readOnly />
        </div>

        <div>
          <label htmlFor="correo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Correo electrónico / Usuario
          </label>
          <input id="correo" name="correo" type="email" className={inputStyle} value={currentUser.email} readOnly />
        </div>

        <div>
          <label htmlFor="rol" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Rol
          </label>
          <input id="rol" name="rol" type="text" className={inputStyle} value={currentUser.rol} readOnly />
        </div>
      </div>
    </div>
  );
}
