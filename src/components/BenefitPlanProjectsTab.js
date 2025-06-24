import React from 'react';
import { Tab } from '@material-ui/core';
import { formatMessage, PublishedComponent } from '@openimis/fe-core';
import { BENEFIT_PLAN_PROJECTS_TAB_VALUE } from '../constants';

function BenefitPlanProjectsTabLabel({
  intl, onChange, tabStyle, isSelected,
}) {
  return (
    <Tab
      onChange={onChange}
      className={tabStyle(BENEFIT_PLAN_PROJECTS_TAB_VALUE)}
      selected={isSelected(BENEFIT_PLAN_PROJECTS_TAB_VALUE)}
      value={BENEFIT_PLAN_PROJECTS_TAB_VALUE}
      label={formatMessage(intl, 'benefitPlan', 'projects.label')}
    />
  );
}

function BenefitPlanProjectsTabPanel({
  value, benefitPlan, rights,
}) {
  return (
    <PublishedComponent
      pubRef="policyHolder.TabPanel"
      module="benefitPlan"
      index={BENEFIT_PLAN_PROJECTS_TAB_VALUE}
      value={value}
    >
      <PublishedComponent
        pubRef="benefitPlan.BenefitPlanProjectsSearcher"
        benefitPlanId={benefitPlan?.id}
        benefitPlanName={benefitPlan?.name}
        rights={rights}
      />
    </PublishedComponent>
  );
}

export { BenefitPlanProjectsTabLabel, BenefitPlanProjectsTabPanel };
