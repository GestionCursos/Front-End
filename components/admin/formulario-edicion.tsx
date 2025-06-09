import { Autoridad } from "@/app/models/Autoridad";

type FormularioEdicionProps = {
    setEditando: React.Dispatch<React.SetStateAction<Autoridad | null>>;
    setFormData: React.Dispatch<React.SetStateAction<Partial<Autoridad>>>;
    setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
    setFotoFile: React.Dispatch<React.SetStateAction<File | null>>;

    formData: Partial<Autoridad>;
    previewUrl: string | null;
    fotoFile: File | null;

    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleGuardar: () => void;
    autoridad: Autoridad;
};

export const FormularioEdicion = ({
    setEditando,
    formData,
    handleChange,
    fotoFile,
    handleFileChange,
    previewUrl,
    handleGuardar
}: FormularioEdicionProps) => {
  return (
  <div className="fixed inset-0 flex z-50">
    {/* Fondo oscuro */}
    <div
      className="flex-1 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={() => setEditando(null)}
    />

    {/* Panel lateral con animación y estilo moderno */}
    <div className="w-full max-w-md h-full bg-white rounded-l-xl shadow-2xl transform transition-all duration-300 ease-in-out flex flex-col animate-slide-in">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-br from-red-600 to-red-800 text-white rounded-tl-xl">
        <h2 className="text-2xl font-bold tracking-tight">Editar Autoridad</h2>
        <button
          onClick={() => setEditando(null)}
          className="text-white text-3xl font-extrabold hover:text-gray-200 transition"
          aria-label="Cerrar formulario"
          type="button"
        >
          &times;
        </button>
      </div>

      {/* Contenido con scroll */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
        {/* Imagen previa */}
        {previewUrl && (
          <div className="flex justify-center">
            <img
              src={previewUrl}
              alt="Vista previa"
              className="w-36 h-36 object-cover rounded-full border-4 border-white shadow-lg"
            />
          </div>
        )}

        {/* Formulario */}
        <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleGuardar(); }}>
          <div>
            <label htmlFor="nombre" className="block text-base font-semibold text-gray-800 mb-2">
              Nombre
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={formData.nombre || ''}
              onChange={handleChange}
              placeholder="Ingrese el nombre"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              required
            />
          </div>

          <div>
            <label htmlFor="cargo" className="block text-base font-semibold text-gray-800 mb-2">
              Cargo
            </label>
            <input
              id="cargo"
              name="cargo"
              type="text"
              value={formData.cargo || ''}
              onChange={handleChange}
              placeholder="Ingrese el cargo"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              required
            />
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-base font-semibold text-gray-800 mb-2">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion || ''}
              onChange={handleChange}
              rows={8}
              placeholder="Describe aquí la autoridad..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 text-base resize-y min-h-[160px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-800 mb-2">
              Foto (JPG/PNG)
            </label>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              className="block w-full text-gray-700 text-base file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer transition"
            />
            {fotoFile && (
              <p className="text-sm text-green-600 mt-2">Archivo seleccionado: {fotoFile.name}</p>
            )}
          </div>
        </form>
      </div>

      {/* Botones abajo */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-4 rounded-bl-xl">
        <button
          onClick={() => setEditando(null)}
          className="px-5 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition font-semibold"
          type="button"
        >
          Cancelar
        </button>
        <button
          onClick={handleGuardar}
          className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
          type="submit"
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
);
}