export interface ServiceConfig {
  icon: string;
  highlight: boolean;
}

export const servicesConfig: ServiceConfig[] = [
  { icon: "Globe", highlight: false },
  { icon: "Smartphone", highlight: true },
  { icon: "LayoutDashboard", highlight: false },
  { icon: "Server", highlight: false },
  { icon: "Database", highlight: false },
  { icon: "Palette", highlight: false },
  { icon: "MessageSquare", highlight: false },
];
