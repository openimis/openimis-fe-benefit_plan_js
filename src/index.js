// Disable due to core architecture
/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import flatten from 'flat';
import React from 'react';
import { Tune } from '@material-ui/icons';
import { FormattedMessage } from '@openimis/fe-core';
import messages_en from './translations/en.json';
import reducer from './reducer';
import BenefitPlanMainMenu from './menus/BenefitPlanMainMenu';
import BenefitPlansPage from './pages/BenefitPlansPage';
import BenefitPlanPage from './pages/BenefitPlanPage';
import ProjectPage from './pages/ProjectPage';
import BenefitPlanSearcher from './components/BenefitPlanSearcher';
import BenefitPlanTaskPreviewTable from './components/BenefitPlanTaskPreviewTable';
import BenefitPlanPicker from './pickers/BenefitPlanPicker';
import { BenefitPlansListTabLabel, BenefitPlansListTabPanel } from './components/BenefitPlansListTab';
import {
  BenefitPlanTaskItemFormatters,
  BenefitPlanTaskTableHeaders,
} from './components/tasks/BenefitPlanTasks';
import {
  fetchBenefitPlanSchemaFields,
  clearBenefitPlan,
  deleteBenefitPlan,
  fetchBenefitPlan,
  fetchBenefitPlans,
} from './actions';
import BenefitPlanHistorySearcher from './components/BenefitPlanHistorySearcher';
import {
  BenefitPlanProjectsTabLabel,
  BenefitPlanProjectsTabPanel,
} from './components/BenefitPlanProjectsTab';
import { BenefitPlanChangelogTabLabel, BenefitPlanChangelogTabPanel } from './components/BenefitPlanChangelogTab';
import { BenefitPlanTaskTabLabel, BenefitPlanTaskTabPanel } from './components/BenefitPlanTaskTab';
import { BENEFIT_PLAN_LABEL, RIGHT_BENEFIT_PLAN_SEARCH } from './constants';
import BenefitPlanFilter from './components/BenefitPlanFilter';
import BenefitPlanSchemaModal from './dialogs/BenefitPlanSchemaModal';

const ROUTE_BENEFIT_PLANS = 'benefitPlans';
const ROUTE_BENEFIT_PLAN = 'benefitPlans/benefitPlan';
const ROUTE_PROJECT = 'project';

const DEFAULT_CONFIG = {
  translations: [{ key: 'en', messages: flatten(messages_en) }],
  reducers: [{ key: 'socialProtection', reducer }],
  'core.MainMenu': [{ name: 'BenefitPlanMainMenu', component: BenefitPlanMainMenu }],
  'core.Router': [
    { path: ROUTE_BENEFIT_PLANS, component: BenefitPlansPage },
    { path: `${ROUTE_BENEFIT_PLAN}/:benefit_plan_uuid?`, component: BenefitPlanPage },
    {
      path: `${ROUTE_BENEFIT_PLAN}/:benefit_plan_uuid?/${ROUTE_PROJECT}/:project_uuid?`,
      component: ProjectPage,
    },
  ],
  refs: [
    { key: 'benefitPlan.route.benefitPlan', ref: ROUTE_BENEFIT_PLAN },
    { key: 'benefitPlan.route.project', ref: ROUTE_PROJECT },
    { key: 'benefitPlan.BenefitPlanSearcher', ref: BenefitPlanSearcher },
    { key: 'benefitPlan.BenefitPlanTaskPreviewTable', ref: BenefitPlanTaskPreviewTable },
    { key: 'benefitPlan.BenefitPlanPicker', ref: BenefitPlanPicker },
    { key: 'benefitPlan.BenefitPlansListTabLabel', ref: BenefitPlansListTabLabel },
    { key: 'benefitPlan.BenefitPlansListTabPanel', ref: BenefitPlansListTabPanel },
    { key: 'benefitPlan.fetchBenefitPlanSchemaFields', ref: fetchBenefitPlanSchemaFields },
    { key: 'benefitPlan.BenefitPlanHistorySearcher', ref: BenefitPlanHistorySearcher },
  ],
  'benefitPlan.TabPanel.label': [
    BenefitPlanProjectsTabLabel,
    BenefitPlanChangelogTabLabel,
    BenefitPlanTaskTabLabel,
  ],
  'benefitPlan.TabPanel.panel': [
    BenefitPlanProjectsTabPanel,
    BenefitPlanChangelogTabPanel,
    BenefitPlanTaskTabPanel,
  ],
  'tasksManagement.tasks': [{
    text: <FormattedMessage module="benefitPlan" id="benefitPlan.tasks.update.title" />,
    tableHeaders: BenefitPlanTaskTableHeaders,
    itemFormatters: BenefitPlanTaskItemFormatters,
    taskSource: ['BenefitPlanService'],
    taskCode: BENEFIT_PLAN_LABEL,
  },
  ],
  'socialProtection.MainMenu': [
    {
      text: <FormattedMessage module="socialProtection" id="menu.socialProtection.benefitPlans" />,
      icon: <Tune />,
      route: '/benefitPlans',
      filter: (rights) => rights.includes(RIGHT_BENEFIT_PLAN_SEARCH),
      id: 'socialProtection.benefitPlans',
    },
  ],
};

export {
  BenefitPlanFilter,
  BenefitPlanSchemaModal,
  clearBenefitPlan,
  deleteBenefitPlan,
  fetchBenefitPlans,
  fetchBenefitPlan,
};

export const BenefitPlanModule = (cfg) => ({ ...DEFAULT_CONFIG, ...cfg });
