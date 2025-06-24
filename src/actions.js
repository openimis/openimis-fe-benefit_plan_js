import {
  graphql,
  formatQuery,
  formatPageQuery,
  formatPageQueryWithCount,
  formatMutation,
  formatGQLString,
  graphqlWithVariables,
  prepareMutation,
} from '@openimis/fe-core';
import { ACTION_TYPE } from './reducer';
import {
  CLEAR, ERROR, REQUEST, SUCCESS,
} from './util/action-type';

const BENEFIT_PLAN_FULL_PROJECTION = () => [
  'uuid',
  'id',
  'isDeleted',
  'dateCreated',
  'dateUpdated',
  'version',
  'dateValidFrom',
  'dateValidTo',
  'description',
  'replacementUuid',
  'code',
  'name',
  'type',
  'maxBeneficiaries',
  'ceilingPerBeneficiary',
  'beneficiaryDataSchema',
  'jsonExt',
  'institution',
  'version',
  'userUpdated {username}',
  'hasPaymentPlans',
];

const PROJECT_FULL_PROJECTION = (modulesManager) => [
  'id',
  'benefitPlan {id, name}',
  'name',
  'status',
  'targetBeneficiaries',
  'workingDays',
  'activity {id, name}',
  'location' + modulesManager.getProjection('location.Location.FlatProjection'),
  'isDeleted',
];

export function fetchBenefitPlans(params) {
  const payload = formatPageQueryWithCount('benefitPlan', params, BENEFIT_PLAN_FULL_PROJECTION());
  return graphql(payload, ACTION_TYPE.SEARCH_BENEFIT_PLANS);
}

export function fetchBenefitPlanSchemaFields(params) {
  const payload = formatQuery('benefitPlanSchemaField', params, ['schemaFields']);
  return graphql(payload, ACTION_TYPE.GET_FIELDS_FROM_BF_SCHEMA);
}

export function fetchBenefitPlan(modulesManager, params) {
  const payload = formatPageQuery('benefitPlan', params, BENEFIT_PLAN_FULL_PROJECTION(modulesManager));
  return graphql(payload, ACTION_TYPE.GET_BENEFIT_PLAN);
}


export function fetchBenefitPlanHistory(params) {
  const payload = formatPageQueryWithCount('benefitPlanHistory', params, BENEFIT_PLAN_FULL_PROJECTION());
  return graphql(payload, ACTION_TYPE.SEARCH_BENEFIT_PLANS_HISTORY);
}

export function deleteBenefitPlan(benefitPlan, clientMutationLabel) {
  const benefitPlanUuids = `ids: ["${benefitPlan?.id}"]`;
  const mutation = formatMutation('deleteBenefitPlan', benefitPlanUuids, clientMutationLabel);
  const requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION_TYPE.DELETE_BENEFIT_PLAN), ERROR(ACTION_TYPE.MUTATION)],
    {
      actionType: ACTION_TYPE.DELETE_BENEFIT_PLAN,
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    },
  );
}

export function closeBenefitPlan(benefitPlan, clientMutationLabel) {
  const benefitPlanUuids = `ids: ["${benefitPlan?.id}"]`;
  const mutation = formatMutation('closeBenefitPlan', benefitPlanUuids, clientMutationLabel);
  const requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION_TYPE.CLOSE_BENEFIT_PLAN), ERROR(ACTION_TYPE.MUTATION)],
    {
      actionType: ACTION_TYPE.CLOSE_BENEFIT_PLAN,
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    },
  );
}

function dateTimeToDate(date) {
  return date.split('T')[0];
}

function formatBenefitPlanGQL(benefitPlan) {
  return `
    ${benefitPlan?.id ? `id: "${benefitPlan.id}"` : ''}
    ${benefitPlan?.name ? `name: "${formatGQLString(benefitPlan.name)}"` : ''}
    ${benefitPlan?.code ? `code: "${formatGQLString(benefitPlan.code)}"` : ''}
    ${benefitPlan?.maxBeneficiaries ? `maxBeneficiaries: ${benefitPlan.maxBeneficiaries}` : ''}
    ${benefitPlan?.ceilingPerBeneficiary ? `ceilingPerBeneficiary: "${benefitPlan.ceilingPerBeneficiary}"` : ''}
    ${benefitPlan?.institution ? `institution: "${formatGQLString(benefitPlan.institution)}"` : 'institution: ""'}
    ${benefitPlan?.type ? `type: ${benefitPlan.type}` : ''}
    ${benefitPlan?.dateValidFrom ? `dateValidFrom: "${dateTimeToDate(benefitPlan.dateValidFrom)}"` : ''}
    ${benefitPlan?.dateValidTo ? `dateValidTo: "${dateTimeToDate(benefitPlan.dateValidTo)}"` : ''}
    ${benefitPlan?.description ? `description: "${formatGQLString(benefitPlan.description)}"` : 'description: ""'}
    ${benefitPlan?.beneficiaryDataSchema
    ? `beneficiaryDataSchema: ${JSON.stringify(benefitPlan.beneficiaryDataSchema)}` : 'beneficiaryDataSchema: "{}"'}
    ${benefitPlan?.jsonExt ? `jsonExt: ${JSON.stringify(benefitPlan.jsonExt)}` : ''}`;
}

function formatProjectGQL(project) {
  return `
    ${project?.id ? `id: "${project.id}"` : ''}
    ${project?.name ? `name: "${formatGQLString(project.name)}"` : ''}
    ${project?.targetBeneficiaries ? `targetBeneficiaries: ${project.targetBeneficiaries}` : ''}
    ${project?.workingDays ? `workingDays: ${project.workingDays}` : ''}
    ${project?.status ? `status: "${project.status}"` : ''}
    ${project?.activity?.id ? `activityId: "${project.activity.id}"` : ''}
    ${project?.location?.uuid ? `locationId: "${project.location.uuid}"` : ''}
    ${project?.benefitPlan?.id ? `benefitPlanId: "${project.benefitPlan.id}"` : ''}`;
}

export function createBenefitPlan(benefitPlan, clientMutationLabel) {
  const mutation = formatMutation('createBenefitPlan', formatBenefitPlanGQL(benefitPlan), clientMutationLabel);
  const requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION_TYPE.CREATE_BENEFIT_PLAN), ERROR(ACTION_TYPE.MUTATION)],
    {
      actionType: ACTION_TYPE.CREATE_BENEFIT_PLAN,
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    },
  );
}

export function updateBenefitPlan(benefitPlan, clientMutationLabel) {
  const mutation = formatMutation('updateBenefitPlan', formatBenefitPlanGQL(benefitPlan), clientMutationLabel);
  const requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION_TYPE.UPDATE_BENEFIT_PLAN), ERROR(ACTION_TYPE.MUTATION)],
    {
      actionType: ACTION_TYPE.UPDATE_BENEFIT_PLAN,
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    },
  );
}

export function fetchBenefitPlanProjects(modulesManager, params) {
  const payload = formatPageQueryWithCount('project', params, PROJECT_FULL_PROJECTION(modulesManager));
  return graphql(payload, ACTION_TYPE.SEARCH_PROJECTS);
}

export function fetchProject(modulesManager, params) {
  const payload = formatPageQuery('project', params, PROJECT_FULL_PROJECTION(modulesManager));
  return graphql(payload, ACTION_TYPE.GET_PROJECT);
}

export function createProject(project, clientMutationLabel) {
  const mutation = formatMutation('createProject', formatProjectGQL(project), clientMutationLabel);
  const requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION_TYPE.CREATE_PROJECT), ERROR(ACTION_TYPE.MUTATION)],
    {
      actionType: ACTION_TYPE.CREATE_PROJECT,
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    },
  );
}

export function updateProject(project, clientMutationLabel) {
  const mutation = formatMutation('updateProject', formatProjectGQL(project), clientMutationLabel);
  const requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION_TYPE.UPDATE_PROJECT), ERROR(ACTION_TYPE.MUTATION)],
    {
      actionType: ACTION_TYPE.UPDATE_PROJECT,
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    },
  );
}

export function deleteProject(project, clientMutationLabel) {
  const projectUuids = `ids: ["${project?.id}"]`;
  const mutation = formatMutation('deleteProject', projectUuids, clientMutationLabel);
  const requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    [
      REQUEST(ACTION_TYPE.MUTATION),
      SUCCESS(ACTION_TYPE.DELETE_PROJECT),
      ERROR(ACTION_TYPE.MUTATION),
    ],
    {
      actionType: ACTION_TYPE.DELETE_PROJECT,
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    },
  );
}

export function undoDeleteProject(project, clientMutationLabel) {
  const projectUuids = `ids: ["${project?.id}"]`;
  const mutation = formatMutation('undoDeleteProject', projectUuids, clientMutationLabel);
  const requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    [
      REQUEST(ACTION_TYPE.MUTATION),
      SUCCESS(ACTION_TYPE.UNDO_DELETE_PROJECT),
      ERROR(ACTION_TYPE.MUTATION),
    ],
    {
      actionType: ACTION_TYPE.UNDO_DELETE_PROJECT,
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    },
  );
}

export function benefitPlanCodeValidationCheck(modulesManager, variables) {
  return graphqlWithVariables(
    `
      query ($bfCode: String!) {
        isValid: 
            bfCodeValidity(bfCode: $bfCode) {
                isValid
            }
      }
      `,
    variables,
    ACTION_TYPE.BENEFIT_PLAN_CODE_FIELDS_VALIDATION,
  );
}

export function benefitPlanNameValidationCheck(modulesManager, variables) {
  return graphqlWithVariables(
    `
      query ($bfName: String!) {
        isValid: 
            bfNameValidity(bfName: $bfName) {
                isValid
        }
      }
      `,
    variables,
    ACTION_TYPE.BENEFIT_PLAN_NAME_FIELDS_VALIDATION,
  );
}

export function benefitPlanSchemaValidationCheck(modulesManager, variables) {
  return graphqlWithVariables(
    `
      query ($bfSchema: String!) {
        isValid: 
            bfSchemaValidity(bfSchema: $bfSchema) {
                isValid
                errorMessage
        }
      }
      `,
    variables,
    ACTION_TYPE.BENEFIT_PLAN_SCHEMA_FIELDS_VALIDATION,
  );
}

export const benefitPlanCodeSetValid = () => (dispatch) => {
  dispatch({ type: ACTION_TYPE.BENEFIT_PLAN_CODE_SET_VALID });
};

export const benefitPlanNameSetValid = () => (dispatch) => {
  dispatch({ type: ACTION_TYPE.BENEFIT_PLAN_NAME_SET_VALID });
};

export const benefitPlanSchemaSetValid = () => (dispatch) => {
  dispatch({ type: ACTION_TYPE.BENEFIT_PLAN_SCHEMA_SET_VALID });
};

export const benefitPlanCodeValidationClear = () => (dispatch) => {
  dispatch({
    type: CLEAR(ACTION_TYPE.BENEFIT_PLAN_CODE_FIELDS_VALIDATION),
  });
};

export const benefitPlanNameValidationClear = () => (dispatch) => {
  dispatch({
    type: CLEAR(ACTION_TYPE.BENEFIT_PLAN_NAME_FIELDS_VALIDATION),
  });
};

export const benefitPlanSchemaValidationClear = () => (dispatch) => {
  dispatch({
    type: CLEAR(ACTION_TYPE.BENEFIT_PLAN_SCHEMA_FIELDS_VALIDATION),
  });
};

export const clearBenefitPlan = () => (dispatch) => {
  dispatch({
    type: CLEAR(ACTION_TYPE.GET_BENEFIT_PLAN),
  });
};

// formatTaskResolveGQL and  resolveTask are exact copy of one from tasksManagement.
// However, import from other @openimis/fe-{modue} than fe-core is not possible.
export const formatTaskResolveGQL = (task, user, approveOrFail, additionalData) => `
  ${task?.id ? `id: "${task.id}"` : ''}
  ${user && approveOrFail ? `businessStatus: "{\\"${user.id}\\": \\"${approveOrFail}\\"}"` : ''}
  ${additionalData ? `additionalData: "${JSON.stringify(additionalData)}"` : ''}
  `;

export function resolveTask(task, clientMutationLabel, user, approveOrFail, additionalData = null) {
  const mutationType = 'resolveTask'; // 'resolveTask'
  const mutationInput = formatTaskResolveGQL(task, user, approveOrFail, additionalData);
  // eslint-disable-next-line
  const ACTION = ACTION_TYPE.RESOLVE_TASK;
  const mutation = formatMutation(mutationType, mutationInput, clientMutationLabel);
  const requestedDateTime = new Date();

  const userId = user?.id;

  const mutation2 = prepareMutation(
    `mutation ($clientMutationLabel:String, $clientMutationId: String, $id:UUID!, 
      $businessStatus: JSONString!, ${additionalData ? '$additionalData: JSONString!' : ''}
    ) {
      resolveTask(
      input: {
        clientMutationId: $clientMutationId
        clientMutationLabel: $clientMutationLabel
  
        id: $id
        businessStatus: $businessStatus
        ${additionalData ? 'additionalData: $additionalData' : ''}
              }
            ) {
              clientMutationId
              internalId
            }
          }`,
    {
      id: task?.id,
      businessStatus: (() => {
        if (!userId) return undefined;

        switch (approveOrFail) {
          case 'APPROVED':
          case 'FAILED':
            return JSON.stringify({ [userId]: approveOrFail });
          case 'ACCEPT':
          case 'REJECT':
            return JSON.stringify({ [userId]: { [approveOrFail]: additionalData } });
          default:
            throw new Error('Invalid approveOrFail value');
        }
      })(),
      // eslint-disable-next-line max-len
      additionalData: additionalData ? JSON.stringify({ entries: additionalData, decision: additionalData }) : undefined,
    },
    {
      id: task?.id,
      businessStatus: (() => {
        if (!userId) return undefined;

        switch (approveOrFail) {
          case 'APPROVED':
          case 'FAILED':
            return JSON.stringify({ [userId]: approveOrFail });
          case 'ACCEPT':
          case 'REJECT':
            return JSON.stringify({ [userId]: { [approveOrFail]: additionalData } });
          default:
            throw new Error('Invalid approveOrFail value');
        }
      })(),
      // eslint-disable-next-line max-len
      additionalData: additionalData ? JSON.stringify({ entries: additionalData, decision: additionalData }) : undefined,
    },
  );

  // eslint-disable-next-line no-param-reassign
  user.clientMutationId = mutation.clientMutationId;

  return graphqlWithVariables(
    mutation2.operation,
    {
      ...mutation2.variables.input,
    },
    ['TASK_MANAGEMENT_MUTATION_REQ', 'TASK_MANAGEMENT_MUTATION_RESP', 'TASK_MANAGEMENT_MUTATION_ERR'],
    {
      requestedDateTime, clientMutationId: mutation.clientMutationId, clientMutationLabel, userId: user.id,
    },
  );
}

export function projectNameValidationCheck(modulesManager, variables) {
  return graphqlWithVariables(
    `
      query ($projectName: String!, $benefitPlanId: String!) {
        isValid: projectNameValidity(projectName: $projectName, benefitPlanId: $benefitPlanId) {
          isValid
        }
      }
    `,
    variables,
    ACTION_TYPE.PROJECT_NAME_FIELDS_VALIDATION,
  );
}

export const projectNameSetValid = () => (dispatch) => {
  dispatch({ type: ACTION_TYPE.PROJECT_NAME_SET_VALID });
};

export const projectNameValidationClear = () => (dispatch) => {
  dispatch({
    type: CLEAR(ACTION_TYPE.PROJECT_NAME_FIELDS_VALIDATION),
  });
};

const WORKFLOWS_FULL_PROJECTION = () => [
  'name',
  'group',
];

export function fetchWorkflows() {
  const payload = formatQuery(
    'workflow',
    ['group: "beneficiary"'],
    WORKFLOWS_FULL_PROJECTION(),
  );
  return graphql(payload, ACTION_TYPE.GET_WORKFLOWS);
}
