import React from "react";

interface ItemConNombre {
  id: number;
  nombre: string;
}

interface MultiSelectRestriccionProps<T extends ItemConNombre> {
  titulo: string;
  items: T[];
  selected: number[] | null;
  onChange: (value: number[] | null) => void;
  descripcionSinRestriccion?: string;
}

export default function MultiSelectRestriccion<T extends ItemConNombre>({
  titulo,
  items,
  selected,
  onChange,
  descripcionSinRestriccion = "Sin restricción",
}: MultiSelectRestriccionProps<T>) {
  const isSinRestriccion = selected === null;

  const handleToggle = (id: number) => {
    if (selected === null) return;
    if (selected.includes(id)) {
      const updated = selected.filter((c) => c !== id);
      onChange(updated.length ? updated : null);
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="font-medium block">{titulo}</label>

      <div className="space-y-1">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isSinRestriccion}
            onChange={() => onChange(isSinRestriccion ? [] : null)}
          />
          <span>{descripcionSinRestriccion}</span>
        </label>

        {!isSinRestriccion &&
          items.map((item) => (
            <label key={item.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selected?.includes(item.id) || false}
                onChange={() => handleToggle(item.id)}
              />
              <span>{item.nombre}</span>
            </label>
          ))}
      </div>
    </div>
  );
}
