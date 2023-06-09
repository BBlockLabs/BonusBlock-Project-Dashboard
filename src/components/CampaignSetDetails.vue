<template>
  <el-form
    label-position="top"
    @submit.prevent="() => $emit('submit', ...arguments)"
  >
    <h1 class="mt-0"><b>Set your Campaign Details</b></h1>

    <el-form-item
      v-bind="ValidationHelper.getFormItemErrorAttributes(validate['name'])"
      label="Campaign Name"
    >
      <el-input v-model="campaignFormObject.name" placeholder="Campaign Name" />
    </el-form-item>

    <el-form-item
      v-bind="
        ValidationHelper.getFormItemErrorAttributes(validate['timeFrame'])
      "
    >
      <el-col class="w-100">
        <label class="el-form-item__label">
          Campaign Period, date & time (UTC+2)
          <el-tooltip
            effect="light"
            content="Campaign overall period, users' activity will be calculated in this timeframe"
            placement="top-start"
            :offset="-20"
          >
            <el-icon class="tooltip-icon">
              <InfoFilled />
            </el-icon>
          </el-tooltip>
        </label>
        <el-row>
          <el-date-picker
            v-model="campaignFormObject.timeFrame"
            :disabled-date="pickerDisableDatesInPast"
            format="YYYY/MM/DD HH:mm"
            type="datetimerange"
          />
        </el-row>
      </el-col>
    </el-form-item>

    <h1>Set rewards</h1>

    <el-form-item class="">
      <el-row class="w-100" :gutter="12" style="flex-wrap: wrap">
        <el-col :span="12" style="min-width: 20em">
          <el-form-item
            v-bind="
              ValidationHelper.getFormItemErrorAttributes(
                validate['rewardPoolContract']
              )
            "
          >
            <template #label>
              <span>
                <label class="el-form-item__label">
                  Token
                  <el-tooltip
                    effect="light"
                    content="Smart Contract to be used for reward distribution"
                    placement="top-start"
                    :offset="-20"
                  >
                    <el-icon class="tooltip-icon">
                      <InfoFilled />
                    </el-icon>
                  </el-tooltip>
                </label>
              </span>
            </template>

            <contract-select-field
              v-model="campaignFormObject.rewardPoolContract"
              class="w-100"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12" style="min-width: 20em">
          <el-form-item
            v-bind="
              ValidationHelper.getFormItemErrorAttributes(
                validate['rewardPoolTokenCount']
              )
            "
          >
            <template #label>
              <span>
                <label class="el-form-item__label">
                  Amount
                  <el-tooltip
                    effect="light"
                    content="Total amount of reward to be distributed during the campaign"
                    placement="top-start"
                    :offset="-20"
                  >
                    <el-icon class="tooltip-icon">
                      <InfoFilled />
                    </el-icon>
                  </el-tooltip>
                </label>
              </span>
            </template>

            <token-input
              v-model="campaignFormObject.rewardPoolTokenCount"
              :contract="contract"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form-item>

    <h3>
      Reward frequency ratio
      <el-tooltip
        effect="light"
        content="
        Determine how important is the interaction count with the product.
        For example, If you set 90% in Daily and 10% Weekly, users that connect with your campaign daily will get the highest incentives."
        placement="top-start"
        :offset="-20"
      >
        <el-icon class="tooltip-icon"><InfoFilled /></el-icon>
      </el-tooltip>
    </h3>

    <el-form-item label="Reward frequency ratio">
      <span class="text-secondary">
        Determine how important is the interaction count with the product. For
        example, If you set 90% in Daily and 10% Weekly, users that connect with
        your campaign daily will get the highest incentives.
      </span>

      <el-row justify="space-between" class="w-100">
        <el-col :span="-1">
          <b>Daily: {{ 100 - campaignFormObject.frequencyRatio }} %</b>
        </el-col>

        <el-col :span="-1">
          <b>Weekly: {{ campaignFormObject.frequencyRatio }} %</b>
        </el-col>
      </el-row>

      <el-slider
        v-model="campaignFormObject.frequencyRatio"
        :show-tooltip="false"
      />
    </el-form-item>

    <el-form-item label="Priority weights">
      <span class="text-secondary">
        Determine the ratio of priority for which the user gets rewarded more
        based on frequency of user interaction with the product or total number
        of performed interactions.
      </span>

      <el-row justify="space-between" class="w-100">
        <el-col :span="-1">
          <b
            >Frequency of interactions:
            {{ 100 - campaignFormObject.weightRatio }} %</b
          >
        </el-col>

        <el-col :span="-1">
          <b
            >Quantity of interactions: {{ campaignFormObject.weightRatio }} %</b
          >
        </el-col>
      </el-row>

      <el-slider
        v-model="campaignFormObject.weightRatio"
        :show-tooltip="false"
      />
    </el-form-item>

    <el-form-item
      v-bind="
        ValidationHelper.getFormItemErrorAttributes(
          validate['minimumPerUserAward']
        )
      "
    >
      <label class="el-form-item__label">
        Minimum reward per user
        <el-tooltip
          effect="light"
          content="Guaranteed reward amount that each eligible user will receive"
          placement="top-start"
          :offset="-50"
        >
          <el-icon class="tooltip-icon">
            <info-filled />
          </el-icon>
        </el-tooltip>
      </label>
      <token-input
        v-model="campaignFormObject.minimumPerUserAward"
        :disabled="
          !campaignFormObject.rewardPoolContract ||
          !campaignFormObject.rewardPoolTokenCount
        "
        :contract="contract"
      />
    </el-form-item>

    <el-form-item
      v-bind="
        ValidationHelper.getFormItemErrorAttributes(
          validate['maximumPerUserAward']
        )
      "
    >
      <label class="el-form-item__label">
        Maximum reward per user
        <el-tooltip
          effect="light"
          content="Maximal reward amount that each eligible user will receive"
          placement="top-start"
          :offset="-50"
        >
          <el-icon class="tooltip-icon">
            <info-filled />
          </el-icon>
        </el-tooltip>
      </label>
      <token-input
        v-model="campaignFormObject.maximumPerUserAward"
        :disabled="
          !campaignFormObject.rewardPoolContract ||
          !campaignFormObject.rewardPoolTokenCount
        "
        :contract="contract"
      />
    </el-form-item>

    <h1>Other</h1>

    <el-row :gutter="12">
      <el-col :span="13">
        <el-form-item
          v-bind="
            ValidationHelper.getFormItemErrorAttributes(
              validate['expectedReturnOfInvestment']
            )
          "
        >
          <label class="el-form-item__label">
            Expected CAC
            <el-tooltip
              effect="light"
              content="Expected Customer Acquisition Cost"
              placement="top-start"
              :offset="-50"
            >
              <el-icon class="tooltip-icon">
                <info-filled />
              </el-icon>
            </el-tooltip>
          </label>
          <el-input v-model="campaignFormObject.expectedReturnOfInvestment">
            <template #prefix>
              <span class="text-secondary"> $ </span>
              &nbsp;
            </template>
          </el-input>
        </el-form-item>
      </el-col>

      <el-col :span="11">
        <el-form-item class="m-0" label="&nbsp;">
          <el-switch
            v-model="campaignFormObject.weeklyEqualDistribution"
            active-text="Weekly equal distribution"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <debug-wrapper>{{ campaignFormObject }}</debug-wrapper>
  </el-form>
</template>

<script>
import CampaignValidationBuilder from "@/common/validation/CampaignValidationBuilder.js";
import ValidationHelper from "@/common/validation/ValidationHelper.js";
import ContractSelectField from "@/components/ContractSelectField.vue";
import CampaignFormObject from "@/common/Form/CampaignFormObject.js";
import TokenInput from "@/components/TokenInput.vue";
import moment from "moment";

export default {
  components: {
    TokenInput,
    ContractSelectField,
  },
  props: {
    modelValue: {
      type: CampaignFormObject,
      default: () => new CampaignFormObject(),
    },
    validation: {
      type: Object,
      default: () => null,
    },
  },
  emits: ["submit", "update:modelValue"],
  /**
   * @returns {{campaignFormObject: CampaignFormObject, validate: Object}}
   */
  data() {
    return {
      campaignFormObject: this.modelValue,
    };
  },
  computed: {
    ValidationHelper: () => ValidationHelper,
    contract() {
      return this.$store.getters["Contract/getContract"](
        this.campaignFormObject.rewardPoolContract
      );
    },
    validate() {
      if (this.validation) {
        return this.validation;
      }

      const validation = CampaignValidationBuilder.createValidation(
        this.campaignFormObject
      );

      validation.$lazy = true;

      return validation;
    },
  },
  watch: {
    "campaignFormObject.rewardPoolContract"() {
      this.campaignFormObject.minimumPerUserAward = "";
      this.campaignFormObject.maximumPerUserAward = "";
    },
    modelValue() {
      this.campaignFormObject = this.modelValue;
    },
    campaignFormObject: {
      deep: true,
      handler() {
        this.$emit("update:modelValue", this.campaignFormObject);
      },
    },
  },
  methods: {
    pickerDisableDatesInPast(date) {
      return !moment().isSameOrBefore(date, "day");
    },
  },
};
</script>

<style lang="scss" scoped>
h1 {
  margin-bottom: 0.5em;
}

::v-deep(.el-slider) {
  .el-slider__bar {
    display: none;
  }
}
</style>
