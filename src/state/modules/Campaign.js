import ActionResponse from "@/common/ActionResponse";
import Campaign from "@/state/models/Campaign.js";
import { HttpRequest } from "@/common/HttpRequest.js";
import Contract from "@/state/models/Contract.js";
import Network from "@/state/models/Network.js";
import Product from "@/state/models/Product.js";
import Category from "@/state/models/Category.js";
import RewardedActivity from "@/state/models/RewardedActivity.js";
import Action from "@/state/models/Action.js";

const sleep = async (milliseconds) => {
  return new Promise((r) => {
    window.setTimeout(r, milliseconds);
  });
};

export class CampaignState {
  /**
   * @type {Map<string, Campaign>}
   */
  campaigns = new Map();
}

export default {
  namespaced: true,
  state: new CampaignState(),
  getters: {
    /**
     * @param {CampaignState} state
     * @returns {Array<Campaign>}
     */
    getAllCampaigns(state) {
      const campaigns = [];

      state.campaigns.forEach((campaign) => {
        campaigns.push(campaign);
      });

      return campaigns;
    },
    /**
     * @param {CampaignState} state
     * @returns {function(string): Campaign | null}
     */
    getCampaign: (state) => (campaignId) => {
      if (!state.campaigns.has(campaignId)) {
        return null;
      }

      return state.campaigns.get(campaignId);
    },
  },
  mutations: {
    /**
     * @param {CampaignState} state
     * @param {Campaign} campaign
     */
    setCampaign(state, campaign) {
      state.campaigns.set(campaign.id, campaign);
    },
    /**
     * @param {CampaignState} state
     * @param {string} campaignId
     */
    removeCampaign(state, campaignId) {
      if (!state.campaigns.has(campaignId)) {
        return;
      }

      state.campaigns.delete(campaignId);
    },
  },
  actions: {
    /**
     * @param getters
     * @param commit
     * @param {string} campaignId
     * @param {"DRAFT"|"confirmed"|"payed"|"running"|"ended"|"cancelled"|"deleted"} status
     * @returns {Promise<ActionResponse>}
     */
    async changeStatus({ getters, commit }, { campaignId, status }) {
      const campaignDto = getters["getCampaign"](campaignId)?.toDto() || null;

      if (campaignDto === null) {
        return new ActionResponse(false, null, ["CAMPAIGN_NOT_FOUND"]);
      }

      // simulate request
      await sleep(500);

      campaignDto.status = status;
      ///////

      commit("setCampaign", Campaign.fromDto(campaignDto));

      if (campaignDto.name === "fail") {
        return new ActionResponse(false, null, ["REQUEST_FAILED"]);
      }

      return new ActionResponse(true, campaignDto.id);
    },
    async loadCampaigns({ commit }) {
      const response = await HttpRequest.makeRequest("campaign/list");

      if (!response.success) {
        return new ActionResponse(false, null, response.errors);
      }

      /**
       * @type {Array<CampaignDto>}
       */
      const payload = response.payload;

      payload.forEach((campaignDto) => {
        if (campaignDto.rewardPool) {
          commit(
            "Contract/setContract",
            Contract.fromDto(campaignDto.rewardPool),
            { root: true }
          );
        }

        if (campaignDto.network) {
          commit("Network/setNetwork", Network.fromDto(campaignDto.network), {
            root: true,
          });
        }

        if (campaignDto.product) {
          commit("Product/setProduct", Product.fromDto(campaignDto.product), {
            root: true,
          });
        }

        campaignDto.categories.forEach((categoryDto) => {
          commit("Category/setCategory", Category.fromDto(categoryDto), {
            root: true,
          });
        });

        campaignDto.actions.forEach((rewardedActivityDto) => {
          const rewardedActivity =
            RewardedActivity.fromDto(rewardedActivityDto);

          rewardedActivity.campaign = campaignDto.id;

          commit(
            "Activity/setAction",
            Action.fromDto(rewardedActivityDto.productActivityAction),
            { root: true }
          );

          commit("RewardedActivity/setRewardedActivity", rewardedActivity, {
            root: true,
          });
        });

        commit("setCampaign", Campaign.fromDto(campaignDto));
      });

      return new ActionResponse(false, null, response.errors);
    },
    /**
     * @param getters
     * @param rootGetters
     * @param commit
     * @param {string} campaignId
     * @returns {Promise<ActionResponse>}
     */
    async storeCampaign({ getters, rootGetters, commit }, campaignId) {
      const campaign = getters["getCampaign"](campaignId);

      if (campaign === null) {
        return new ActionResponse(false, null, ["CAMPAIGN_NOT_FOUND"]);
      }

      const campaignDto = campaign.toDto() || null;

      campaignDto.actions = rootGetters["RewardedActivity/getByCampaign"](
        campaignId
      ).map((rewardedActivity) => rewardedActivity.toDto());

      const endpoint =
        campaign.getId() !== null
          ? `campaign/${campaign.id}/update`
          : "campaign/create";

      const response = await HttpRequest.makeRequest(endpoint, campaignDto);

      if (!response.success) {
        return new ActionResponse(false, null, response.errors);
      }

      if (response.payload !== campaignId) {
        campaign.id = response.payload;

        commit("removeCampaign", campaignId);
        commit("setCampaign", campaign);

        rootGetters["RewardedActivity/getByCampaign"](campaignId).forEach(
          (rewardedActivity) => {
            rewardedActivity.campaign = campaign.id;

            commit("RewardedActivity/setRewardedActivity", rewardedActivity, {
              root: true,
            });
          }
        );
      }

      return new ActionResponse(true, campaign.id);
    },
  },
};
