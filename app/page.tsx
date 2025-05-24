"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { SiteLayout } from "@/components/site-layout"
import { Calendar, BookOpen, Users, Award, Clock, MapPin } from "lucide-react"
import './globals.css'
import { useEffect, useState } from "react"
import * as contenidoHomeService from "./Services/contenidoHomeService"
import * as autoridadesService from "./Services/autoridadesService"

export default function Home() {
  const [contenido, setContenido] = useState<any>(null)
  const [autoridades, setAutoridades] = useState<any[]>([])
  const [showFullDesc, setShowFullDesc] = useState<{ [id: number]: boolean }>({})
  const [modalAutoridad, setModalAutoridad] = useState<any | null>(null)

  useEffect(() => {
    async function fetchContenido() {
      try {
        const data = await contenidoHomeService.getContenidoHome()
        setContenido(data)
      } catch (error) {
        setContenido([])
      }
    }
    fetchContenido()
  }, [])

  useEffect(() => {
    async function fetchAutoridades() {
      try {
        const data = await autoridadesService.getAutoridades()
        setAutoridades(Array.isArray(data) ? data.filter(a => a.visible) : [])
      } catch (error) {
        setAutoridades([])
      }
    }
    fetchAutoridades()
  }, [])

  // Mostrar loading
  if (!contenido) {
    return (
      <SiteLayout>
        <div className="flex justify-center items-center min-h-screen">
          <span>Cargando contenido...</span>
        </div>
      </SiteLayout>
    )
  }

  // Mostrar error si la respuesta no es un array
  if (!Array.isArray(contenido)) {
    return (
      <SiteLayout>
        <div className="flex justify-center items-center min-h-screen">
          <span>Error al cargar el contenido.</span>
        </div>
      </SiteLayout>
    )
  }

  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-white -z-10"></div>
        <div className="absolute inset-0 opacity-10 -z-10">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-red-200"></div>
          <div className="absolute top-40 right-20 w-32 h-32 rounded-full bg-red-200"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 rounded-full bg-red-200"></div>
          <div className="absolute bottom-40 right-1/3 w-16 h-16 rounded-full bg-red-200"></div>
        </div>
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
              <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Eventos y cursos de calidad
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                Aprende y <span className="text-primary">conecta</span> con los mejores
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Descubre eventos y cursos diseñados para impulsar tu carrera profesional. Aprende nuevas habilidades y
                conecta con expertos de la industria.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="auth-button">
                  <Link href="/events">Explorar eventos</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-primary/30 text-primary">
                  <Link href="/courses">Ver cursos</Link>
                </Button>
              </div>
              <div className="mt-8 flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium">+10,000 participantes satisfechos</div>
                  <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                    <span className="ml-1 text-sm text-muted-foreground">4.9/5</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative rounded-lg overflow-hidden shadow-2xl border border-primary/10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 "></div>
                <Image
                  src="https://csei.uta.edu.ec/csei2021/images/galeria-uta/facultad1.jpg"
                  alt="Evento de EduEvents"
                  width={800}
                  height={600}
                  className="rounded-lg"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary/10 rounded-full"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/10 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

       {/* Autoridades */}
      <section className="py-16 bg-gradient-to-b from-red-50 to-white">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-primary">Nuestras autoridades</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Conoce a quienes lideran nuestra institución.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {autoridades.map((autoridad: any) => {
              const maxDescLength = 320;
              const isLong = autoridad.descripcion.length > maxDescLength;
             
              return (
                <div key={autoridad.id_autoridad} className="flex flex-col items-center bg-white rounded-2xl shadow-xl border border-primary/10 p-6 hover:shadow-2xl transition-shadow relative min-h-[370px] max-w-xs mx-auto group">
                  <div className="relative w-28 h-28 rounded-full overflow-hidden shadow mb-4 border-4 border-primary/20 bg-white flex items-center justify-center">
                    <Image
                      src={autoridad.foto_url}
                      alt={autoridad.nombre}
                      fill
                      className="object-contain"
                      style={{ objectPosition: 'center top' }}
                    />
                  </div>
                  <h4 className="font-extrabold text-lg text-primary mb-1 text-center uppercase tracking-wide leading-tight group-hover:text-primary/80 transition-colors">{autoridad.nombre}</h4>
                  <p className="text-xs text-primary/70 mb-2 text-center font-semibold uppercase tracking-wider leading-tight">{autoridad.cargo}</p>
                  <div className="relative w-full flex-1 flex flex-col">
                    <div className="text-xs text-muted-foreground text-justify w-full px-0" style={{lineHeight: '1.5', maxHeight: '7.5em', overflow: 'hidden', position: 'relative'}}>
                      {autoridad.descripcion.slice(0, 400)}{autoridad.descripcion.length > 400 ? '...' : ''}
                    </div>
                    {autoridad.descripcion.length > 400 && (
                      <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-auto text-primary border-primary/40 text-xs font-semibold hover:bg-primary/10 focus:outline-none px-4 py-1.5 shadow-sm"
                    onClick={() => setModalAutoridad(autoridad)}
                    type="button"
                  >
                    Ver más
                  </Button>
                </div>
              );
            })}
          </div>

      {/* Modal para mostrar información completa de la autoridad */}
      {modalAutoridad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl p-0 max-w-md w-[95vw] max-h-[90vh] relative flex flex-col animate-fade-in">
            <button
              className="absolute top-2 right-2 text-primary text-2xl font-bold hover:text-red-500 z-10"
              onClick={() => setModalAutoridad(null)}
              aria-label="Cerrar"
            >
              ×
            </button>
            <div className="flex flex-col items-center p-6 overflow-y-auto" style={{maxHeight: '80vh'}}>
              <div className="relative w-24 h-24 rounded-full overflow-hidden shadow mb-4 border-2 border-primary/20 bg-white flex items-center justify-center">
                <Image
                  src={modalAutoridad.foto_url}
                  alt={modalAutoridad.nombre}
                  fill
                  className="object-contain"
                  style={{ objectPosition: 'center top' }}
                />
              </div>
              <h4 className="font-bold text-lg text-primary mb-1 text-center uppercase tracking-wide">{modalAutoridad.nombre}</h4>
              <p className="text-sm text-primary/80 mb-3 text-center font-semibold uppercase tracking-wider">{modalAutoridad.cargo}</p>
              <div className="text-sm text-muted-foreground text-justify w-full px-0" style={{lineHeight: '1.6'}}>
                {modalAutoridad.descripcion.split(/(TERCER NIVEL|CUARTO NIVEL|DOCTORADO|MAESTR[ÍI]A|DIPLOMA[DT]O|LICENCIAD[OA]|INGENIER[OA]|ECONOMISTA|PSIC[ÓO]LOG[OA]|ABOGAD[OA]|PROFESOR[AE]|T[ÉE]CNIC[OA]|MAGISTER|DOCTORA?)/gi).map((part: string, idx: number) => {
                  if (["TERCER NIVEL","CUARTO NIVEL","DOCTORADO","MAESTRÍA","MAESTRIA","DIPLOMADO","DIPLOMATA","LICENCIADO","LICENCIADA","INGENIERO","INGENIERA","ECONOMISTA","PSICÓLOGA","PSICÓLOGO","ABOGADA","ABOGADO","PROFESORA","PROFESOR","TÉCNICO","TÉCNICA","MAGISTER","DOCTORA","DOCTOR"].includes(part.trim().toUpperCase())) {
                    return <div key={idx} className="mt-2 mb-1 font-bold text-primary/90 text-xs tracking-widest uppercase">{part}</div>;
                  }
                  return <span key={idx}>{part}</span>;
                })}
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
      </section>

       {/* Contenido Home dinámico */}
      <section className="py-16 bg-gradient-to-b from-primary/5 to-white">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary">Recursos destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contenido.map((item: any) => (
              <div key={item.id_contenido} className="bg-white rounded-2xl border-2 border-primary/20 shadow-md p-6 flex flex-col items-start hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold mb-2 text-primary/90">{item.titulo}</h3>
                <p className="text-muted-foreground mb-2">{item.descripcion}</p>
                {item.url_foto && item.url_foto !== '.' && (
                  <div className="mt-4 w-full flex justify-center">
                    <Image src={item.url_foto} alt={item.titulo} width={240} height={140} className="rounded-lg border border-primary/10 shadow-sm object-cover max-h-36" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Próximos eventos</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              No te pierdas nuestros eventos destacados. Conferencias, talleres y networking con profesionales de la
              industria.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Conferencia de Desarrollo Web 2023",
                date: "15 de Junio, 2023",
                location: "Madrid, España",
                image: "/placeholder.svg?height=200&width=400",
              },
              {
                title: "Workshop de UX/UI Design",
                date: "22 de Junio, 2023",
                location: "Barcelona, España",
                image: "/placeholder.svg?height=200&width=400",
              },
              {
                title: "Masterclass de Marketing Digital",
                date: "30 de Junio, 2023",
                location: "Valencia, España",
                image: "/placeholder.svg?height=200&width=400",
              },
            ].map((event, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-primary/10 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <Button asChild className="w-full auth-button">
                    <Link href="/events">Reservar plaza</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="outline" className="border-primary/30 text-primary">
              <Link href="/events">Ver todos los eventos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-gradient-to-b from-white to-red-50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Cursos destacados</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Amplía tus conocimientos con nuestros cursos impartidos por expertos en cada área.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Desarrollo Full Stack",
                instructor: "María González",
                duration: "12 semanas",
                level: "Intermedio",
                price: "299€",
                image: "/placeholder.svg?height=200&width=400",
              },
              {
                title: "Diseño UX/UI Avanzado",
                instructor: "Carlos Martínez",
                duration: "8 semanas",
                level: "Avanzado",
                price: "249€",
                image: "/placeholder.svg?height=200&width=400",
              },
              {
                title: "Marketing Digital Completo",
                instructor: "Laura Sánchez",
                duration: "10 semanas",
                level: "Todos los niveles",
                price: "199€",
                image: "/placeholder.svg?height=200&width=400",
              },
            ].map((course, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-primary/10 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  <Image src={course.image || "/placeholder.svg"} alt={course.title} fill className="object-cover" />
                  <div className="absolute bottom-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 m-2 rounded-full">
                    {course.price}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <Users className="h-4 w-4 mr-2" />
                    <span className="text-sm">{course.instructor}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">{course.duration}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground mb-4">
                    <Award className="h-4 w-4 mr-2" />
                    <span className="text-sm">{course.level}</span>
                  </div>
                  <Button asChild className="w-full auth-button">
                    <Link href="/courses">Ver detalles</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="outline" className="border-primary/30 text-primary">
              <Link href="/courses">Ver todos los cursos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">¿Por qué elegirnos?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubre por qué miles de profesionales confían en nosotros para su desarrollo profesional.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 border border-primary/10 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Instructores expertos</h3>
              <p className="text-muted-foreground">Aprende de profesionales con amplia experiencia en la industria.</p>
            </div>
            <div className="p-6 border border-primary/10 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Contenido actualizado</h3>
              <p className="text-muted-foreground">Materiales y temarios siempre al día con las últimas tendencias.</p>
            </div>
            <div className="p-6 border border-primary/10 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Comunidad activa</h3>
              <p className="text-muted-foreground">Conecta con otros profesionales y amplía tu red de contactos.</p>
            </div>
            <div className="p-6 border border-primary/10 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Flexibilidad horaria</h3>
              <p className="text-muted-foreground">Eventos y cursos adaptados a diferentes horarios y necesidades.</p>
            </div>
          </div>
        </div>
      </section>
     

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¿Listo para impulsar tu carrera?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Únete a miles de profesionales que ya están mejorando sus habilidades con nuestros eventos y cursos.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link href="/register">Inscribirse ahora</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <Link href="/contact">Contactar</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
