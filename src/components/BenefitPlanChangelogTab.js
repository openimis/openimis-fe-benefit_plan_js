import React from 'react';
import { Tab } from '@material-ui/core';
import { formatMessage, PublishedComponent } from '@openimis/fe-core';
import { BENEFIT_PLAN_CHANGELOG_TAB_VALUE } from '../constants';

function BenefitPlanChangelogTabLabel({
  intl, onChange, tabStyle, isSelected,
}) {
  return (
    <Tab
      onChange={onChange}
      className={tabStyle(BENEFIT_PLAN_CHANGELOG_TAB_VALUE)}
      selected={isSelected(BENEFIT_PLAN_CHANGELOG_TAB_VALUE)}
      value={BENEFIT_PLAN_CHANGELOG_TAB_VALUE}
      label={formatMessage(intl, 'benefitPlan', 'benefitPlanChangelog.label')}
    />
  );
}

function BenefitPlanChangelogTabPanel({
  value, benefitPlan,
}) {
  return (
    <PublishedComponent
      pubRef="policyHolder.TabPanel"
      module="benefitPlan"
      index={BENEFIT_PLAN_CHANGELOG_TAB_VALUE}
      value={value}
    >
      <PublishedComponent
        pubRef="benefitPlan.BenefitPlanHistorySearcher"
        benefitPlanId={benefitPlan?.id}
      />
    </PublishedComponent>
  );
}

export { BenefitPlanChangelogTabLabel, BenefitPlanChangelogTabPanel };
