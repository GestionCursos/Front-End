import { useCallback, useState } from 'react';
import { getSolicitudesGenerales } from '@/app/Services/dashboardService';
import { SolicitudGeneral } from '@/app/models/SolicitudGeneral';

export function useSolicitudesGenerales() {
  const [solicitudes, setSolicitudes] = useState<SolicitudGeneral[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSolicitudes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSolicitudesGenerales();
      setSolicitudes(data);
    } finally {
      setLoading(false);
    }
  }, []);

  return { solicitudes, loading, refetch: fetchSolicitudes, setSolicitudes };
}
