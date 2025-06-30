import Solicitud from "@/app/Services/solicitudService";

declare global {
    interface Window {
        jspdf?: any;
    }
}

const bannerUrl =
    "https://scontent.fuio26-1.fna.fbcdn.net/v/t39.30808-6/311586012_528977262569685_3610733298273233828_n.png?_nc_cat=103&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=ze6B1577AYcQ7kNvwFvn1bw&_nc_oc=AdkatIWQayc8GFlvJ06rZanM5JXG7U9nAp5XnEDQGYXDIe8pxkPMXKIGiTZIHxb7c9A&_nc_zt=23&_nc_ht=scontent.fuio26-1.fna&_nc_gid=LCYme4NHNFsjnrH_9Q5nCw&oh=00_AfNBeMqQMfNeRb3a5EC1Aw4A7OzbTFUcGH_jgDuMbbGmBg&oe=6868D55C";

async function getBannerBase64(): Promise<string | ArrayBuffer | null> {
    const blob = await fetch(bannerUrl).then((res) => res.blob());
    return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}
export const generarReporteAprobaciones = async () => {
    if (!window.jspdf) {
        await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    if (!window.jspdf?.autoTable) {
        await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    const jsPDF = window.jspdf.jsPDF;
    const doc = new jsPDF();

    const imageData = await getBannerBase64();
    doc.addImage(imageData, "PNG", 0, 0, 210, 30);

    const data = await Solicitud.obtenerReporteAprobaciones();

    const yStart = 33;


    doc.setFontSize(18);
    doc.text("Reporte de Aprobaciones/Rechazos", 105, yStart, { align: "center" });

    doc.autoTable({
        startY: yStart + 10,
        head: [["#", "Apartado", "Tipo", "Urgencia", "Estado", "Justificación", "Aprobado por", "Correo"]],
        body: data.map((item: any, i: number) => [
            i + 1,
            item.apartado,
            item.tipo_cambio,
            item.urgencia,
            item.estado_aprobacion,
            item.justificacion_aprobacion,
            item.aprobado_por,
            item.correo_aprobador,
        ]),
        styles: { fontSize: 10, font: "helvetica" },
        headStyles: {
            fillColor: [158, 27, 50],
            textColor: 255,
            halign: "center",
            fontStyle: "bold",
        },
    });

    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
};
