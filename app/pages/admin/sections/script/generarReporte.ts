import { Organizador } from "@/app/models/Curso";
import { getDataReporteGeneral, getDataReporteOrganizador } from "@/app/Services/reporteService";

declare global {
    interface Window {
        jspdf?: any;
    }
}
type TipoReporte = "curso" | "organizador";


interface Estudiante {
    nombre: string;
    email: string;
    asistencia: string;
    nota: number;
    estado: string;
}

interface ReporteData {
    nombre_evento: string;
    instructor: string;
    estudiantes: Estudiante[];
}

interface CursoOrganizado {
    nombre: string;
    inscritos: number;
    promedio: number;
}

interface ReporteOrganizadorData {
    organizador: Organizador;
    cursos: CursoOrganizado[];
}
export class ReportePDF {
    private jsPDF: any;
    private doc: any;
    private imageUrl: string;
    private lugar: string = "Ambato, Ecuador";

    constructor(private tipo: TipoReporte, private id: number) {
        this.imageUrl = "https://scontent.fuio13-1.fna.fbcdn.net/v/t39.30808-6/311586012_528977262569685_3610733298273233828_n.png?_nc_cat=103&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=euFjeum-vB4Q7kNvwEuVwqr&_nc_oc=AdmJ2JwWyL75qHYpfWl0_gPeC-8F_kM3rvDCPiBOSyefaLFMn8iUDVoPtyTe22IYTGc&_nc_zt=23&_nc_ht=scontent.fuio13-1.fna&_nc_gid=B6nKmvVw6eGdaRCURav5tw&oh=00_AfLmuDAWa4v5ygW6usgQ1Da3zjHn1SDYnUkC0e5aLXrn6w&oe=683C025C"; // Usa aquí tu URL real
    }

    async init() {
        await this.loadLibraries();
        this.doc = new this.jsPDF();
    }

    private async loadLibraries() {
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

        this.jsPDF = window.jspdf.jsPDF;
    }

    private async getImageData(): Promise<string | ArrayBuffer | null> {
        const blob = await fetch(this.imageUrl).then(res => res.blob());
        return await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }

    async generar() {
        await this.init();
        if (this.tipo === "curso") {
            await this.generarReporteCurso();
        } else if (this.tipo === "organizador") {
            await this.generarReporteOrganizador();
        }
    }

    private async getCursoData(): Promise<ReporteData> {
        const data = await getDataReporteGeneral(this.id);
        console.log(data)
        return {
            nombre_evento: data.nombre_evento,
            instructor: data.instructor,
            estudiantes: data.estudiantes.map((item: any) => ({
                nombre: item.estudiante,
                email: item.correo,
                asistencia: item.asistencia + '%',
                nota: item.nota,
                estado: item.estado.toUpperCase()
            }))
        };
    }



    private generarPieFirma() {
        const doc = this.doc;
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(9);
        doc.text(`${this.lugar} - ${new Date().toLocaleDateString()}`, 14, pageHeight - 15);
        doc.text("___________________________", 150, pageHeight - 20);
        doc.text("Responsable académico", 160, pageHeight - 15);
    }


    private abrirPDF() {
        const pdfBlob = this.doc.output("blob");
        const blobUrl = URL.createObjectURL(pdfBlob);
        window.open(blobUrl, "_blank");
    }

    private async getOrganizadorData(): Promise<ReporteOrganizadorData> {
        const data = await getDataReporteOrganizador(this.id);
        return {
            organizador: data.organizador,
            cursos: data.cursos.map((curso: any) => ({
                nombre: curso.nombre,
                inscritos: Number(curso.inscritos) ,
                promedio: Number(curso.promedio) 
            }))
        };
    }



    private async generarReporteOrganizador() {
        const doc = this.doc;
        const imageData = await this.getImageData();
        const data = await this.getOrganizadorData();

        doc.addImage(imageData, 'PNG', 0, 0, 210, 30);
        doc.setFontSize(18);
        doc.text("REPORTE DE CURSOS POR ORGANIZADOR", 105, 42, { align: "center" });

        const promedio = data.cursos.reduce((acc, curso) => acc + curso.promedio, 0) / data.cursos.length||0;
        const detalles = [
            ["Nombre del organizador:", data.organizador.nombre],
            ["Correo:", data.organizador.correo],
            ["Institución:", data.organizador.institucion],
            ["Fecha:", new Date().toLocaleDateString()],
            ["Promedio general:", promedio.toFixed(2)]
        ];
        let y = 60;
        detalles.forEach(([label, value]) => {
            doc.setFontSize(11);
            doc.text(label, 16, y);
            doc.text(value, 70, y);
            y += 6;
        });

        doc.autoTable({
            startY: y + 4,
            head: [["#", "Nombre del Curso", "Inscritos", "Promedio"]],
            body: data.cursos.map((curso, i) => [
                i + 1,
                curso.nombre,
                curso.inscritos,
                curso.promedio.toFixed(2)
            ]),
            styles: { fontSize: 10, font: "helvetica" },
            headStyles: {
                fillColor: [158, 27, 50],
                textColor: 255,
                halign: 'center',
                fontStyle: 'bold'
            }
        });

        this.generarPieFirma();
        this.abrirPDF();
    }
    async generarReporteCurso() {
        await this.init();

        const doc = this.doc;
        const imageData = await this.getImageData();
        const data = await this.getCursoData();

        const promedio = data.estudiantes.reduce((acc, est) => acc + est.nota, 0) / data.estudiantes.length;

        doc.addImage(imageData, 'PNG', 0, 0, 210, 30);

        // Título
        doc.setFontSize(18);
        doc.text("REPORTE DE PARTICIPACIÓN", 105, 42, { align: "center" });
        doc.setFontSize(12);
        doc.text("Evento académico", 105, 50, { align: "center" });

        // Detalles
        const detalles = [
            ["Nombre del evento:", data.nombre_evento],
            ["Instructor:", data.instructor],
            ["Promedio general:", promedio.toFixed(2)],
            ["Ubicación:", this.lugar],
            ["Fecha:", new Date().toLocaleDateString()]
        ];
        let y = 68;
        detalles.forEach(([label, value]) => {
            doc.text(label, 16, y);
            doc.text(value, 70, y);
            y += 6;
        });

        // Tabla
        doc.autoTable({
            startY: y + 4,
            head: [["#", "Nombre", "Email", "Asistencia", "Nota", "Estado"]],
            body: data.estudiantes.map((est, i) => [
                i + 1,
                est.nombre,
                est.email,
                est.asistencia,
                est.nota,
                est.estado
            ]),
            styles: { fontSize: 10, font: "helvetica" },
            headStyles: {
                fillColor: [158, 27, 50],
                textColor: 255,
                halign: 'center',
                fontStyle: 'bold'
            }
        });

        // Resumen
        const total = data.estudiantes.length;
        const aprobados = data.estudiantes.filter(e => e.estado === "APROBADO").length;
        const reprobados = total - aprobados;
        doc.text(`Resumen: ${total} estudiantes - ${aprobados} aprobados, ${reprobados} reprobados`, 14, doc.lastAutoTable.finalY + 10);

        this.generarPieFirma();
        this.abrirPDF();
    }
}
