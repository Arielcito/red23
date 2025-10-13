import {
  ImageIcon,
  MessageCircle,
  Smartphone,
  Clock,
  Users,
  Target,
  BarChart3
} from "lucide-react"
import { LucideIcon } from "lucide-react"

export interface Stat {
  icon: LucideIcon
  number: string
  label: string
}

export interface Feature {
  icon: LucideIcon
  title: string
  description: string
  color: string
}

export interface Benefit {
  icon: LucideIcon
  title: string
  description: string
  color: string
}

export interface Testimonial {
  content: string
  name: string
  role: string
  avatar: string
  rating: number
}

export const stats: Stat[] = [
  {
    icon: ImageIcon,
    number: "10,000+",
    label: "Imágenes generadas"
  },
  {
    icon: Users,
    number: "500+",
    label: "Clientes activos"
  },
  {
    icon: Clock,
    number: "5 seg",
    label: "Tiempo promedio"
  },
  {
    icon: MessageCircle,
    number: "98%",
    label: "Satisfacción"
  }
]

export const features: Feature[] = [
  {
    icon: ImageIcon,
    title: "Generación con IA",
    description: "Crea imágenes profesionales usando inteligencia artificial de última generación",
    color: "text-primary-500"
  },
  {
    icon: MessageCircle,
    title: "Publicación Automática",
    description: "Publica directamente en WhatsApp sin necesidad de intervención manual",
    color: "text-secondary-500"
  },
  {
    icon: Smartphone,
    title: "Interfaz Intuitiva",
    description: "Diseño simple y fácil de usar, sin curva de aprendizaje",
    color: "text-tertiary-500"
  },
  {
    icon: Clock,
    title: "Resultados Rápidos",
    description: "Genera y publica contenido en cuestión de segundos",
    color: "text-primary-500"
  }
]

export const benefits: Benefit[] = [
  {
    icon: Target,
    title: "Resultados Garantizados",
    description: "O te devolvemos tu dinero",
    color: "bg-primary-100"
  },
  {
    icon: BarChart3,
    title: "Métricas en Tiempo Real",
    description: "Monitorea tu rendimiento",
    color: "bg-secondary-100"
  },
  {
    icon: Users,
    title: "Comunidad Activa",
    description: "Aprende de otros usuarios",
    color: "bg-tertiary-100"
  }
]

export const benefitsList = [
  "Ahorra hasta 10 horas semanales en creación de contenido",
  "Aumenta tu engagement hasta un 300%",
  "Sin necesidad de diseñadores o herramientas complejas",
  "Integración perfecta con WhatsApp Business",
  "Soporte técnico 24/7 en español"
]

export const testimonials: Testimonial[] = [
  {
    content: "Esta plataforma transformó completamente nuestra estrategia de marketing. Generamos contenido profesional en minutos y nuestro engagement se triplicó.",
    name: "María González",
    role: "Directora de Marketing",
    avatar: "/placeholder.svg",
    rating: 5
  },
  {
    content: "La integración con WhatsApp es perfecta. Ahora publicamos contenido de calidad constantemente sin esfuerzo adicional. Una herramienta imprescindible.",
    name: "Carlos Rodríguez",
    role: "CEO de Startup",
    avatar: "/placeholder.svg",
    rating: 5
  },
  {
    content: "Increíble la calidad de las imágenes generadas por IA. Nuestros clientes piensan que tenemos un equipo de diseñadores. El ROI ha sido excepcional.",
    name: "Ana Martínez",
    role: "Gerente de Ventas",
    avatar: "/placeholder.svg",
    rating: 5
  }
]
