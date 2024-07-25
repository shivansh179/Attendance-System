 
export type SiteConfig = typeof siteConfig;

export const siteConfig = {



  name: "CIIE - SRM University",
  description:
    "Welcome to the Center of Innovation, Incubation and Entrepreneurship",
  navItems: [
    {
      label: "Login",
      href: "/",
    },
    {
     
      href: "/attendance",
    },
    
    
  ],

  loginNavMenuItems:  [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Reports",
      href: "/projects",
    },
    {
      label: "Verge",
      href: "/verge",
    },
    {
      label: "Events",
      href: "/events",
    },
    {
      label: "My Settings",
      href: "/setting",
    },
    {
      label: "Team Settings",
      href: "/",
    },
  
    {
      label: "System",
      href: "/",
    },
    {
      label: "Help And Feedback",
      href: "/helpAndFeedback",
    },
    {
      label: "About Us",
      href: "/about",
    },
    {
      label: "Logout",
      href: "/",
    },
  ],

 
};
