export type ProjectCategory = 'landing-page' | 'e-commerce' | 'corporate' | 'portfolio' | 'custom';
export type ProjectSize = 'major' | 'simple';

export interface ProjectImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface ProjectTestimonial {
  quote: string;
  author: string;
  role?: string;
  company?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  category: ProjectCategory;
  size: ProjectSize;
  featured: boolean;
  thumbnail: ProjectImage;
  heroImage: ProjectImage;
  gallery?: ProjectImage[];
  technologies: string[];
  clientName?: string;
  liveUrl?: string;
  testimonial?: ProjectTestimonial;
  completedDate: string;
  order: number;
}

// Legacy interface for backward compatibility with Carousel component
export interface LegacyProject {
  imagesrc: string;
  imageAlt: string;
  link: string;
}
