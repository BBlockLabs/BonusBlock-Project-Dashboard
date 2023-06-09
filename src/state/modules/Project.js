import { HttpRequest } from "@/common/HttpRequest.js";
import ActionResponse from "@/common/ActionResponse.js";
import Project from "@/state/models/Project.js";

export default {
  namespaced: true,
  state: {
    currentProject: null,
  },
  getters: {
    /**
     * @param {object} state
     * @return {Project}
     */
    getProject(state) {
      return state.currentProject;
    },
  },
  mutations: {
    /**
     * @param {object} state
     * @param {Project} project
     */
    setProject(state, project) {
      state.currentProject = project;
    },
  },
  actions: {
    /**
     * @param {function(String, any)} commit
     * @param {{title: String, image: String}} projectData
     * @return {Promise<ActionResponse>}
     */
    async createProject({ commit }, projectData) {
      const requestBody = {
        title: projectData.title,
        image: projectData.image.data,
        imageType: projectData.image.type,
      };
      let response;
      try {
        response = await HttpRequest.makeRequest(
            "project/create",
            requestBody
        );
      } catch (e) {
        return new ActionResponse(false, null, e);
      }

      const project = new Project(response.payload);

      commit("setProject", project);

      return new ActionResponse(true, project);
    },
    async updateProject({ commit }, projectUpdateData) {
      let response;
      try {
        response = await HttpRequest.makeRequest(
            "project/update",
            projectUpdateData
        );
      } catch (e) {
        return new ActionResponse(false, null, e);
      }

      const project = new Project(response.payload);

      commit("setProject", project);

      return new ActionResponse(true, project);
    },
  },
};
