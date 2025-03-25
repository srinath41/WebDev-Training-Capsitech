import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProjectDetails } from "../services/api";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await fetchProjectDetails(projectId);
        setProject(data);
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };
    loadProject();
  }, [projectId]);

  if (!project) return <p>Loading project...</p>;

  return (
    <div>
      <h2>{project.name}</h2>
      <p>{project.description}</p>
    </div>
  );
};

export default ProjectDetails;
