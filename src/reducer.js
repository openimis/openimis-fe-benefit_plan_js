// Disabled due to consistency with other modules
/* eslint-disable default-param-last */

import {
  decodeId,
  dispatchMutationErr,
  dispatchMutationReq,
  dispatchMutationResp,
  formatGraphQLError,
  formatServerError,
  pageInfo,
  parseData,
} from '@openimis/fe-core';
import {
  CLEAR, ERROR, REQUEST, SUCCESS,
} from './util/action-type';

export const ACTION_TYPE = {
  MUTATION: 'BENEFIT_PLAN_MUTATION',
  TASK_MUTATION: 'TASK_MANAGEMENT_MUTATION',
  SEARCH_BENEFIT_PLANS: 'BENEFIT_PLAN_BENEFIT_PLANS',
  GET_BENEFIT_PLAN: 'BENEFIT_PLAN_BENEFIT_PLAN',
  CREATE_BENEFIT_PLAN: 'BENEFIT_PLAN_CREATE_BENEFIT_PLAN',
  DELETE_BENEFIT_PLAN: 'BENEFIT_PLAN_DELETE_BENEFIT_PLAN',
  CLOSE_BENEFIT_PLAN: 'BENEFIT_PLAN_CLOSE_BENEFIT_PLAN',
  UPDATE_BENEFIT_PLAN: 'BENEFIT_PLAN_UPDATE_BENEFIT_PLAN',
  BENEFIT_PLAN_CODE_FIELDS_VALIDATION: 'BENEFIT_PLAN_CODE_FIELDS_VALIDATION',
  BENEFIT_PLAN_NAME_FIELDS_VALIDATION: 'BENEFIT_PLAN_NAME_FIELDS_VALIDATION',
  BENEFIT_PLAN_SCHEMA_FIELDS_VALIDATION: 'BENEFIT_PLAN_SCHEMA_FIELDS_VALIDATION',
  BENEFIT_PLAN_CODE_SET_VALID: 'BENEFIT_PLAN_CODE_SET_VALID',
  BENEFIT_PLAN_NAME_SET_VALID: 'BENEFIT_PLAN_NAME_SET_VALID',
  BENEFIT_PLAN_SCHEMA_SET_VALID: 'BENEFIT_PLAN_NAME_SET_VALID',
  GET_FIELDS_FROM_BF_SCHEMA: 'GET_FIELDS_FROM_BF_SCHEMA',
  RESOLVE_TASK: 'TASK_MANAGEMENT_RESOLVE_TASK',
  SEARCH_BENEFIT_PLANS_HISTORY: 'BENEFIT_PLAN_BENEFIT_PLANS_HISTORY',
  SEARCH_PROJECTS: 'BENEFIT_PLAN_PROJECTS',
  GET_PROJECT: 'BENEFIT_PLAN_PROJECT',
  CREATE_PROJECT: 'BENEFIT_PLAN_CREATE_PROJECT',
  UPDATE_PROJECT: 'BENEFIT_PLAN_UPDATE_PROJECT',
  DELETE_PROJECT: 'BENEFIT_PLAN_DELETE_PROJECT',
  UNDO_DELETE_PROJECT: 'BENEFIT_PLAN_UNDO_DELETE_PROJECT',
  PROJECT_NAME_FIELDS_VALIDATION: 'PROJECT_NAME_FIELDS_VALIDATION',
  PROJECT_NAME_SET_VALID: 'PROJECT_NAME_SET_VALID',
  GET_WORKFLOWS: 'GET_WORKFLOWS',
};

function reducer(
  state = {
    submittingMutation: false,
    mutation: {},
    fetchingBenefitPlans: false,
    errorBenefitPlans: null,
    fetchedBenefitPlans: false,
    benefitPlans: [],
    benefitPlansPageInfo: {},
    benefitPlansTotalCount: 0,
    fetchingBenefitPlan: false,
    errorBenefitPlan: null,
    fetchedBenefitPlan: false,
    benefitPlan: null,
    fieldsFromBfSchema: [],
    fetchingFieldsFromBfSchema: false,
    fetchedFieldsFromBfSchema: false,
    errorFieldsFromBfSchema: null,
    fetchingBenefitPlansHistory: false,
    errorBenefitPlansHistory: null,
    fetchedBenefitPlansHistory: false,
    benefitPlansHistory: [],
    benefitPlansHistoryPageInfo: {},
    benefitPlansHistoryTotalCount: 0,
    fetchingProjects: false,
    errorProjects: null,
    fetchedProjects: false,
    projects: [],
    projectsPageInfo: {},
    projectsTotalCount: 0,
    fetchingWorkflows: true,
    fetchedWorkflows: false,
    workflows: [],
    workflowsPageInfo: {},
    workflowsGroupBeneficiaries: null,
    errorWorkflows: null,
  },
  action,
) {
  switch (action.type) {
    case REQUEST(ACTION_TYPE.GET_FIELDS_FROM_BF_SCHEMA):
      return {
        ...state,
        fieldsFromBfSchema: [],
        fetchingFieldsFromBfSchema: true,
        fetchedFieldsFromBfSchema: false,
        errorFieldsFromBfSchema: null,
      };
    case REQUEST(ACTION_TYPE.SEARCH_BENEFIT_PLANS):
      return {
        ...state,
        fetchingBenefitPlans: true,
        fetchedBenefitPlans: false,
        benefitPlans: [],
        benefitPlansPageInfo: {},
        benefitPlansTotalCount: 0,
        errorBenefitPlans: null,
      };
    case REQUEST(ACTION_TYPE.GET_BENEFIT_PLAN):
      return {
        ...state,
        fetchingBenefitPlan: true,
        fetchedBenefitPlan: false,
        benefitPlan: null,
      };
    case REQUEST(ACTION_TYPE.SEARCH_PROJECTS):
      return {
        ...state,
        fetchingProjects: true,
        fetchedProjects: false,
        projects: [],
        projectsPageInfo: {},
        projectsTotalCount: 0,
        errorProjects: null,
      };
    case REQUEST(ACTION_TYPE.GET_PROJECT):
      return {
        ...state,
        fetchingProject: true,
        fetchedProject: false,
        project: null,
      };
    case SUCCESS(ACTION_TYPE.SEARCH_BENEFIT_PLANS):
      return {
        ...state,
        fetchingBenefitPlans: false,
        fetchedBenefitPlans: true,
        benefitPlans: parseData(action.payload.data.benefitPlan)?.map((benefitPlan) => ({
          ...benefitPlan,
          id: decodeId(benefitPlan.id),
        })),
        benefitPlansPageInfo: pageInfo(action.payload.data.benefitPlan),
        benefitPlansTotalCount: action.payload.data.benefitPlan ? action.payload.data.benefitPlan.totalCount : null,
        errorBenefitPlans: formatGraphQLError(action.payload),
      };
    case SUCCESS(ACTION_TYPE.GET_FIELDS_FROM_BF_SCHEMA):
      return {
        ...state,
        fieldsFromBfSchema: action?.payload?.data?.benefitPlanSchemaField?.schemaFields || [],
        fetchingFieldsFromBfSchema: false,
        fetchedFieldsFromBfSchema: true,
        errorFieldsFromBfSchema: formatGraphQLError(action.payload),
      };
    case SUCCESS(ACTION_TYPE.GET_BENEFIT_PLAN):
      return {
        ...state,
        fetchingBenefitPlan: false,
        fetchedBenefitPlan: true,
        benefitPlan: parseData(action.payload.data.benefitPlan)?.map((benefitPlan) => ({
          ...benefitPlan,
          id: decodeId(benefitPlan.id),
        }))?.[0],
        errorBenefitPlan: null,
      };
    case SUCCESS(ACTION_TYPE.SEARCH_PROJECTS):
      return {
        ...state,
        fetchingProjects: false,
        fetchedProjects: true,
        projects: parseData(action.payload.data.project)?.map((project) => ({
          ...project,
          benefitPlan: { id: project?.benefitPlan?.id ? decodeId(project.benefitPlan.id) : null },
          id: decodeId(project.id),
        })),
        projectsPageInfo: pageInfo(action.payload.data.project),
        projectsTotalCount: action.payload.data.project ? action.payload.data.project.totalCount : null,
        errorProjects: formatGraphQLError(action.payload),
      };
    case SUCCESS(ACTION_TYPE.GET_PROJECT):
      return {
        ...state,
        fetchingProject: false,
        fetchedProject: true,
        project: parseData(action.payload.data.project)?.map((project) => ({
          ...project,
          benefitPlan: {
            ...project?.benefitPlan,
            id: project?.benefitPlan?.id ? decodeId(project.benefitPlan.id) : null,
          },
          activity: {
            ...project?.activity,
            id: project?.activity?.id ? decodeId(project.activity.id) : null,
          },
          id: decodeId(project.id),
        }))?.[0],
        errorProject: null,
      };
    case ERROR(ACTION_TYPE.GET_FIELDS_FROM_BF_SCHEMA):
      return {
        ...state,
        fetchingFieldsFromBfSchema: false,
        errorFieldsFromBfSchema: formatGraphQLError(action.payload),
      };
    case ERROR(ACTION_TYPE.SEARCH_BENEFIT_PLANS):
      return {
        ...state,
        fetchingBenefitPlans: false,
        errorBenefitPlans: formatServerError(action.payload),
      };
    case ERROR(ACTION_TYPE.GET_BENEFIT_PLAN):
      return {
        ...state,
        fetchingBenefitPlan: false,
        errorBenefitPlan: formatServerError(action.payload),
      };
    case ERROR(ACTION_TYPE.SEARCH_PROJECTS):
      return {
        ...state,
        fetchingProjects: false,
        errorProjects: formatServerError(action.payload),
      };
    case ERROR(ACTION_TYPE.GET_PROJECT):
      return {
        ...state,
        fetchingProject: false,
        errorProject: formatServerError(action.payload),
      };
    case REQUEST(ACTION_TYPE.BENEFIT_PLAN_CODE_FIELDS_VALIDATION):
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          benefitPlanCode: {
            isValidating: true,
            isValid: false,
            validationError: null,
          },
        },
      };
    case SUCCESS(ACTION_TYPE.BENEFIT_PLAN_CODE_FIELDS_VALIDATION):
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          benefitPlanCode: {
            isValidating: false,
            isValid: action.payload?.data.isValid.isValid,
            validationError: formatGraphQLError(action.payload),
          },
        },
      };
    case ERROR(ACTION_TYPE.BENEFIT_PLAN_CODE_FIELDS_VALIDATION):
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          benefitPlanCode: {
            isValidating: false,
            isValid: false,
            validationError: formatServerError(action.payload),
          },
        },
      };
    case CLEAR(ACTION_TYPE.BENEFIT_PLAN_CODE_FIELDS_VALIDATION):
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          benefitPlanCode: {
            isValidating: false,
            isValid: false,
            validationError: null,
          },
        },
      };
    case ACTION_TYPE.BENEFIT_PLAN_CODE_SET_VALID:
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          benefitPlanCode: {
            isValidating: false,
            isValid: true,
            validationError: null,
          },
        },
      };
    case REQUEST(ACTION_TYPE.BENEFIT_PLAN_NAME_FIELDS_VALIDATION):
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          benefitPlanName: {
            isValidating: true,
            isValid: false,
            validationError: null,
          },
        },
      };
    case SUCCESS(ACTION_TYPE.BENEFIT_PLAN_NAME_FIELDS_VALIDATION):
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          benefitPlanName: {
            isValidating: false,
            isValid: action.payload?.data.isValid.isValid,
            validationError: formatGraphQLError(action.payload),
          },
        },
      };
    case ERROR(ACTION_TYPE.BENEFIT_PLAN_NAME_FIELDS_VALIDATION):
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          benefitPlanName: {
            isValidating: false,
            isValid: false,
            validationError: formatServerError(action.payload),
          },
        },
      };
    case CLEAR(ACTION_TYPE.BENEFIT_PLAN_NAME_FIELDS_VALIDATION):
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          benefitPlanName: {
            isValidating: false,
            isValid: false,
            validationError: null,
          },
        },
      };
    case ACTION_TYPE.BENEFIT_PLAN_NAME_SET_VALID:
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          benefitPlanName: {
            isValidating: false,
            isValid: true,
            validationError: null,
          },
        },
      };
    case REQUEST(ACTION_TYPE.BENEFIT_PLAN_SCHEMA_FIELDS_VALIDATION):
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          benefitPlanSchema: {
            isValidating: true,
            isValid: false,
            validationError: null,
          },
        },
      };
    case SUCCESS(ACTION_TYPE.BENEFIT_PLAN_SCHEMA_FIELDS_VALIDATION):
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          benefitPlanSchema: {
            isValidating: false,
            isValid: action.payload?.data.isValid.isValid,
            validationError: formatGraphQLError(action.payload),
          },
        },
      };
    case ERROR(ACTION_TYPE.BENEFIT_PLAN_SCHEMA_FIELDS_VALIDATION):
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          benefitPlanSchema: {
            isValidating: false,
            isValid: false,
            validationError: formatServerError(action.payload),
          },
        },
      };
    case CLEAR(ACTION_TYPE.BENEFIT_PLAN_SCHEMA_FIELDS_VALIDATION):
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          benefitPlanSchema: {
            isValidating: false,
            isValid: false,
            validationError: null,
          },
        },
      };
    case ACTION_TYPE.BENEFIT_PLAN_SCHEMA_SET_VALID:
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          benefitPlanSchema: {
            isValidating: false,
            isValid: true,
            validationError: null,
          },
        },
      };
    case CLEAR(ACTION_TYPE.GET_BENEFIT_PLAN):
      return {
        ...state,
        fetchingBenefitPlan: false,
        errorBenefitPlan: null,
        fetchedBenefitPlan: false,
        benefitPlan: null,
        mutation: null,
      };
    case REQUEST(ACTION_TYPE.SEARCH_BENEFIT_PLANS_HISTORY):
      return {
        ...state,
        fetchingBenefitPlansHistory: true,
        fetchedBenefitPlansHistory: false,
        benefitPlansHistory: [],
        benefitPlansHistoryPageInfo: {},
        benefitPlansHistoryTotalCount: 0,
        errorBenefitPlansHistory: null,
      };
    case SUCCESS(ACTION_TYPE.SEARCH_BENEFIT_PLANS_HISTORY):
      return {
        ...state,
        fetchingBenefitPlansHistory: false,
        fetchedBenefitPlansHistory: true,
        benefitPlansHistory: parseData(action.payload.data.benefitPlanHistory)?.map((benefitPlanHistory) => ({
          ...benefitPlanHistory,
          id: decodeId(benefitPlanHistory.id),
        })),
        benefitPlansHistoryPageInfo: pageInfo(action.payload.data.benefitPlanHistory),
        // eslint-disable-next-line max-len
        benefitPlansHistoryTotalCount: action.payload.data.benefitPlanHistory ? action.payload.data.benefitPlanHistory.totalCount : null,
        errorBenefitPlansHistory: formatGraphQLError(action.payload),
      };
    case ERROR(ACTION_TYPE.SEARCH_BENEFIT_PLANS_HISTORY):
      return {
        ...state,
        fetchingBenefitPlansHistory: false,
        errorBenefitPlansHistory: formatServerError(action.payload),
      };
    case REQUEST(ACTION_TYPE.PROJECT_NAME_FIELDS_VALIDATION):
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          projectName: {
            isValidating: true,
            isValid: false,
            validationError: null,
          },
        },
      };
    case SUCCESS(ACTION_TYPE.PROJECT_NAME_FIELDS_VALIDATION):
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          projectName: {
            isValidating: false,
            isValid: action.payload?.data.isValid.isValid,
            validationError: formatGraphQLError(action.payload),
          },
        },
      };
    case ERROR(ACTION_TYPE.PROJECT_NAME_FIELDS_VALIDATION):
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          projectName: {
            isValidating: false,
            isValid: false,
            validationError: formatServerError(action.payload),
          },
        },
      };
    case CLEAR(ACTION_TYPE.PROJECT_NAME_FIELDS_VALIDATION):
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          projectName: {
            isValidating: false,
            isValid: false,
            validationError: null,
          },
        },
      };
    case ACTION_TYPE.PROJECT_NAME_SET_VALID:
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          projectName: {
            isValidating: false,
            isValid: true,
            validationError: null,
          },
        },
      };
    case REQUEST(ACTION_TYPE.GET_WORKFLOWS):
      return {
        ...state,
        fetchingWorkflows: true,
        fetchedWorkflows: false,
        workflows: [],
        workflowsPageInfo: {},
        errorWorkflows: null,
      };
    case SUCCESS(ACTION_TYPE.GET_WORKFLOWS):
      return {
        ...state,
        fetchingWorkflows: false,
        fetchedWorkflows: true,
        workflows: action.payload.data.workflow || [],
        workflowsPageInfo: pageInfo(action.payload.data.benefitPlan),
        errorWorkflows: formatGraphQLError(action.payload),
      };
    case ERROR(ACTION_TYPE.GET_WORKFLOWS):
      return {
        ...state,
        fetchingWorkflows: false,
        errorWorkflows: formatServerError(action.payload),
      };
    case REQUEST(ACTION_TYPE.MUTATION):
      return dispatchMutationReq(state, action);
    case ERROR(ACTION_TYPE.MUTATION):
      return dispatchMutationErr(state, action);
    case SUCCESS(ACTION_TYPE.CREATE_BENEFIT_PLAN):
      return dispatchMutationResp(state, 'createBenefitPlan', action);
    case SUCCESS(ACTION_TYPE.DELETE_BENEFIT_PLAN):
      return dispatchMutationResp(state, 'deleteBenefitPlan', action);
    case SUCCESS(ACTION_TYPE.UPDATE_BENEFIT_PLAN):
      return dispatchMutationResp(state, 'updateBenefitPlan', action);
    case SUCCESS(ACTION_TYPE.CREATE_PROJECT):
      return dispatchMutationResp(state, 'createProject', action);
    case SUCCESS(ACTION_TYPE.UPDATE_PROJECT):
      return dispatchMutationResp(state, 'updateProject', action);
    case SUCCESS(ACTION_TYPE.DELETE_PROJECT):
      return dispatchMutationResp(state, 'deleteProject', action);
    case SUCCESS(ACTION_TYPE.UNDO_DELETE_PROJECT):
      return dispatchMutationResp(state, 'undoDeleteProject', action);
    case SUCCESS(ACTION_TYPE.RESOLVE_TASK):
      return dispatchMutationResp(state, 'resolveTask', action);
    case REQUEST(ACTION_TYPE.TASK_MUTATION):
      return dispatchMutationReq(state, action);
    case ERROR(ACTION_TYPE.TASK_MUTATION):
      return dispatchMutationErr(state, action);
    default:
      return state;
  }
}

export default reducer;
