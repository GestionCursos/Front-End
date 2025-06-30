'use client'
import '@/app/globals.css'
import { SiteLayout } from '@/components/site-layout'
import React, { useState } from 'react'


export default function SolicitudTecnicaInterna() {
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        ambito: 'backend',
        tipo: 'nueva-funcionalidad',
        prioridad: 'media',
        responsable: '',
        estado: 'pendiente',
        modulo: '',
        dependencias: '',
        referencias: '',
        estimacion: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Solicitud técnica enviada:', formData)
        // aquí enviarías a tu backend
    }

    return (
    <SiteLayout>
            <div className="max-w-4xl mx-auto p-6 bg-card rounded-2xl shadow-md border">
                <h2 className="text-2xl font-bold text-primary mb-6">Solicitud Técnica Interna</h2>
                <form onSubmit={handleSubmit} className="space-y-6">                    <input 
                        type="text" 
                        name="titulo" 
                        placeholder="Título de la solicitud (ej. Agregar endpoint /api/exportar)" 
                        className="w-full p-3 border rounded-lg bg-background auth-input" 
                        onChange={handleChange} 
                    />                    <textarea
                        name="descripcion"
                        placeholder="Descripción técnica del cambio solicitado, motivación, uso esperado"
                        className="w-full p-3 border rounded-lg bg-background auth-input min-h-[120px]"
                        onChange={handleChange}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-foreground">Ámbito</label>                <select 
                name="ambito" 
                className="w-full p-3 border rounded-lg bg-background auth-input" 
                onChange={handleChange}
            >
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="base-de-datos">Base de Datos</option>
                <option value="infraestructura">Infraestructura</option>
            </select>
                        </div>

            <div>
                            <label className="block text-sm font-medium mb-2 text-foreground">Tipo</label>                            <select 
                                name="tipo" 
                                className="w-full p-3 border rounded-lg bg-background auth-input" 
                                onChange={handleChange}
                            >
                                <option value="nueva-funcionalidad">Nueva funcionalidad</option>
                                <option value="mejora">Mejora / refactorización</option>
                                <option value="deuda-tecnica">Deuda técnica</option>
                                <option value="otro">Otro</option>
                            </select>
                        </div>

            <div>
                            <label className="block text-sm font-medium mb-2 text-foreground">Prioridad</label>                            <select 
                                name="prioridad" 
                                className="w-full p-3 border rounded-lg bg-background auth-input" 
                                onChange={handleChange}
                            >
                                <option value="alta">Alta</option>
                                <option value="media">Media</option>
                                <option value="baja">Baja</option>
                            </select>
                        </div>
                    </div>                    <input
                        type="text"
                        name="modulo"
                        placeholder="Módulo o componente afectado (ej. Autenticación, API de usuarios)"
                        className="w-full p-3 border rounded-lg bg-background auth-input"
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="responsable"
                        placeholder="Responsable sugerido (opcional)"
                        className="w-full p-3 border rounded-lg bg-background auth-input"
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="dependencias"
                        placeholder="Dependencias (módulos, APIs, otros equipos)"
                        className="w-full p-3 border rounded-lg bg-background auth-input"
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="referencias"
                        placeholder="Referencias técnicas (documentación, enlaces, archivos)"
                        className="w-full p-3 border rounded-lg bg-background auth-input"
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="estimacion"
                        placeholder="Estimación técnica (ej. 2 días, requiere análisis de seguridad)"
                        className="w-full p-3 border rounded-lg bg-background auth-input"
                        onChange={handleChange}
                    /><div>
                        <label className="block text-sm font-medium mb-2 text-foreground">Estado inicial</label>                            <select 
                            name="estado" 
                            className="w-full p-3 border rounded-lg bg-background auth-input" 
                            onChange={handleChange}
                        >
                            <option value="pendiente">Pendiente</option>
                            <option value="aprobado">Aprobado</option>
                            <option value="en-progreso">En progreso</option>
                        </select>
                    </div>                    <button 
                        type="submit" 
                        className="w-full py-3 auth-button text-white font-semibold rounded-lg transition-all"
                    >
                        Enviar solicitud técnica
                    </button>
                </form>
            </div>
            <p>
            </p>
        </SiteLayout>
    )
}