"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp } from "lucide-react"

interface FilterProps {
  openFilter: string | null
  setOpenFilter: (filter: string | null) => void
  categoriasSeleccionadas: string[]
  setCategoriasSeleccionadas: (categorias: string[]) => void
  modalidad: string
  setModalidad: (modalidad: string) => void
  precioSeleccionado: { min: number; max: number | null }
  setPrecioSeleccionado: (precio: { min: number; max: number | null }) => void
  precioMin: string
  setPrecioMin: (precio: string) => void
  precioMax: string
  setPrecioMax: (precio: string) => void
  fechaInicio: string
  setFechaInicio: (fecha: string) => void
  fechaFin: string
  setFechaFin: (fecha: string) => void
  tiposEventoSeleccionados: string[]
  setTiposEventoSeleccionados: (tipos: string[]) => void
  filters: Array<{
    key: string
    label: string
    options: string[]
    type: "checkbox" | "radio" | "range" | "date"
  }>
}

export function EventFilters({
  openFilter,
  setOpenFilter,
  categoriasSeleccionadas,
  setCategoriasSeleccionadas,
  modalidad,
  setModalidad,
  precioSeleccionado,
  setPrecioSeleccionado,
  precioMin,
  setPrecioMin,
  precioMax,
  setPrecioMax,
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
  tiposEventoSeleccionados,
  setTiposEventoSeleccionados,
  filters,
}: FilterProps) {
  const handleCategoriaChange = (categoria: string, checked: boolean) => {
    if (checked) {
      setCategoriasSeleccionadas([...categoriasSeleccionadas, categoria])
    } else {
      setCategoriasSeleccionadas(categoriasSeleccionadas.filter((c) => c !== categoria))
    }
  }

  const handleTipoEventoChange = (tipo: string, checked: boolean) => {
    if (checked) {
      setTiposEventoSeleccionados([...tiposEventoSeleccionados, tipo])
    } else {
      setTiposEventoSeleccionados(tiposEventoSeleccionados.filter((t) => t !== tipo))
    }
  }

  const aplicarFiltrosPrecio = () => {
    const min = precioMin ? Number.parseInt(precioMin) : 0
    const max = precioMax ? Number.parseInt(precioMax) : null
    setPrecioSeleccionado({ min, max })
  }

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border">
      <h3 className="font-semibold text-lg">Filtros</h3>

      {filters.map((filter) => (
        <Collapsible
          key={filter.key}
          open={openFilter === filter.key}
          onOpenChange={(isOpen) => setOpenFilter(isOpen ? filter.key : null)}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-50 rounded">
            <span className="font-medium">{filter.label}</span>
            {openFilter === filter.key ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="p-2 space-y-2">
            {filter.type === "checkbox" && filter.key === "Categoria" && (
              <div className="space-y-2">
                {filter.options.map((categoria) => (
                  <div key={categoria} className="flex items-center space-x-2">
                    <Checkbox
                      id={categoria}
                      checked={categoriasSeleccionadas.includes(categoria)}
                      onCheckedChange={(checked) => handleCategoriaChange(categoria, checked as boolean)}
                    />
                    <Label htmlFor={categoria} className="text-sm capitalize">
                      {categoria}
                    </Label>
                  </div>
                ))}
              </div>
            )}

            {filter.type === "checkbox" && filter.key === "TipoEvento" && (
              <div className="space-y-2">
                {filter.options.map((tipo) => (
                  <div key={tipo} className="flex items-center space-x-2">
                    <Checkbox
                      id={tipo}
                      checked={tiposEventoSeleccionados.includes(tipo)}
                      onCheckedChange={(checked) => handleTipoEventoChange(tipo, checked as boolean)}
                    />
                    <Label htmlFor={tipo} className="text-sm">
                      {tipo}
                    </Label>
                  </div>
                ))}
              </div>
            )}

            {filter.type === "radio" && filter.key === "Modalidad" && (
              <RadioGroup value={modalidad} onValueChange={setModalidad}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="" id="todas" />
                  <Label htmlFor="todas" className="text-sm">
                    Todas
                  </Label>
                </div>
                {filter.options.map((opcion) => (
                  <div key={opcion} className="flex items-center space-x-2">
                    <RadioGroupItem value={opcion} id={opcion} />
                    <Label htmlFor={opcion} className="text-sm capitalize">
                      {opcion}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {filter.type === "range" && filter.key === "Precio" && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="precio-min" className="text-xs">
                      Mínimo
                    </Label>
                    <Input
                      id="precio-min"
                      type="number"
                      placeholder="0"
                      value={precioMin}
                      onChange={(e) => setPrecioMin(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="precio-max" className="text-xs">
                      Máximo
                    </Label>
                    <Input
                      id="precio-max"
                      type="number"
                      placeholder="Sin límite"
                      value={precioMax}
                      onChange={(e) => setPrecioMax(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
                <Button onClick={aplicarFiltrosPrecio} size="sm" className="w-full">
                  Aplicar
                </Button>
              </div>
            )}

            {filter.type === "date" && filter.key === "Fecha" && (
              <div className="space-y-2">
                <div>
                  <Label htmlFor="fecha-inicio" className="text-xs">
                    Fecha inicio
                  </Label>
                  <Input
                    id="fecha-inicio"
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="fecha-fin" className="text-xs">
                    Fecha fin
                  </Label>
                  <Input
                    id="fecha-fin"
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      ))}

      <Button
        variant="outline"
        onClick={() => {
          setCategoriasSeleccionadas([])
          setModalidad("")
          setPrecioSeleccionado({ min: 0, max: null })
          setPrecioMin("")
          setPrecioMax("")
          setFechaInicio("")
          setFechaFin("")
          setTiposEventoSeleccionados([])
        }}
        className="w-full"
      >
        Limpiar filtros
      </Button>
    </div>
  )
}
