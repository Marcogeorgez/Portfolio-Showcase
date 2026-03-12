import { useQuery } from "@tanstack/react-query";
import { projectsData, experiencesData, skillsData } from "@/data";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      return projectsData;
    },
  });
}

export function useExperiences() {
  return useQuery({
    queryKey: ["experiences"],
    queryFn: async () => {
      return experiencesData;
    },
  });
}

export function useSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      return skillsData;
    },
  });
}
