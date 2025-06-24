import React from 'react';
import {
  Helmet, withModulesManager, formatMessage, withTooltip, historyPush,
} from '@openimis/fe-core';
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import {
  RIGHT_BENEFIT_PLAN_CREATE,
  RIGHT_BENEFIT_PLAN_SEARCH, BENEFIT_PLAN_ROUTE_BENEFIT_PLAN,
} from '../constants';
import BenefitPlanSearcher from '../components/BenefitPlanSearcher';

const styles = (theme) => ({
  page: theme.page,
  fab: theme.fab,
});

function BenefitPlansPage(props) {
  const {
    intl, classes, rights, modulesManager, history,
  } = props;

  console.log('xxx');

  const onAdd = () => historyPush(
    modulesManager,
    history,
    BENEFIT_PLAN_ROUTE_BENEFIT_PLAN,
  );

  return (
    rights.includes(RIGHT_BENEFIT_PLAN_SEARCH) && (
    <div className={classes.page}>
      <Helmet title={formatMessage(intl, 'benefitPlan', 'benefitPlan.benefitPlanHelmet')} />
      <BenefitPlanSearcher rights={rights} />
      {rights.includes(RIGHT_BENEFIT_PLAN_CREATE)
        && withTooltip(
          <div className={classes.fab}>
            <Fab color="primary" onClick={onAdd}>
              <AddIcon />
            </Fab>
          </div>,
          formatMessage(intl, 'benefitPlan', 'createButton.tooltip'),
        )}
    </div>
    )
  );
}

const mapStateToProps = (state) => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
});

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(
  connect(mapStateToProps)(BenefitPlansPage),
))));
