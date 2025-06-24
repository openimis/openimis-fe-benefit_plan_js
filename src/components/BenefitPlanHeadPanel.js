import React from 'react';
import { Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import {
  withModulesManager,
  FormPanel,
  NumberInput,
  ValidatedTextInput,
  ValidatedTextAreaInput,
  TextAreaInput,
  PublishedComponent,
  TextInput,
} from '@openimis/fe-core';
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from '@material-ui/core/styles';
import {
  DESCRIPTION_MAX_LENGTH, MAX_CODE_LENGTH, RIGHT_SCHEMA_UPDATE,
} from '../constants';
import {
  benefitPlanCodeSetValid,
  benefitPlanCodeValidationCheck,
  benefitPlanCodeValidationClear,
  benefitPlanNameSetValid,
  benefitPlanNameValidationCheck,
  benefitPlanNameValidationClear, benefitPlanSchemaSetValid,
  benefitPlanSchemaValidationCheck,
  benefitPlanSchemaValidationClear,
} from '../actions';
import BenefitPlanTypePicker from '../pickers/BenefitPlanTypePicker';

const styles = (theme) => ({
  tableTitle: theme.table.title,
  item: theme.paper.item,
  fullHeight: {
    height: '100%',
  },
});

class BenefitPlanHeadPanel extends FormPanel {
  shouldValidate(inputValue, savedValue) {
    if (!savedValue) return false;
    return !this.props.edited?.id || inputValue !== savedValue;
  }

  render() {
    const {
      edited,
      classes,
      isBenefitPlanCodeValid,
      isBenefitPlanCodeValidating,
      benefitPlanCodeValidationError,
      isBenefitPlanNameValid,
      isBenefitPlanNameValidating,
      benefitPlanNameValidationError,
      savedBenefitPlanCode,
      savedBenefitPlanName,
      isBenefitPlanSchemaValid,
      isBenefitPlanSchemaValidating,
      benefitPlanSchemaValidationError,
      readOnly,
      rights,
    } = this.props;
    const benefitPlan = { ...edited };

    return (
      <Grid container className={classes.item}>
        <Grid item xs={3} className={classes.item}>
          <ValidatedTextInput
            module="benefitPlan"
            label="benefitPlan.code"
            required
            onChange={(v) => this.updateAttribute('code', v)}
            value={benefitPlan?.code ?? ''}
            itemQueryIdentifier="bfCode"
            action={benefitPlanCodeValidationCheck}
            clearAction={benefitPlanCodeValidationClear}
            setValidAction={benefitPlanCodeSetValid}
            shouldValidate={(v) => this.shouldValidate(v, savedBenefitPlanCode)}
            codeTakenLabel="benefitPlan.code.alreadyTaken"
            isValid={isBenefitPlanCodeValid}
            isValidating={isBenefitPlanCodeValidating}
            validationError={benefitPlanCodeValidationError}
            inputProps={{
              maxLength: MAX_CODE_LENGTH,
            }}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <ValidatedTextInput
            module="benefitPlan"
            label="benefitPlan.name"
            required
            onChange={(v) => this.updateAttribute('name', v)}
            value={benefitPlan?.name ?? ''}
            itemQueryIdentifier="bfName"
            action={benefitPlanNameValidationCheck}
            clearAction={benefitPlanNameValidationClear}
            setValidAction={benefitPlanNameSetValid}
            shouldValidate={(v) => this.shouldValidate(v, savedBenefitPlanName)}
            codeTakenLabel="benefitPlan.name.alreadyTaken"
            isValid={isBenefitPlanNameValid}
            isValidating={isBenefitPlanNameValidating}
            validationError={benefitPlanNameValidationError}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <PublishedComponent
            pubRef="core.DatePicker"
            module="benefitPlan"
            label="benefitPlan.dateValidFrom"
            required
            onChange={(v) => this.updateAttribute('dateValidFrom', v)}
            value={benefitPlan?.dateValidFrom ?? ''}
            // NOTE: maxDate cannot be passed if dateValidTo does not exist.
            // Passing any other falsy value will block months manipulation.
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...(benefitPlan.dateValidTo ? { maxDate: benefitPlan.dateValidTo } : null)}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <PublishedComponent
            pubRef="core.DatePicker"
            module="benefitPlan"
            label="benefitPlan.dateValidTo"
            required
            onChange={(v) => this.updateAttribute('dateValidTo', v)}
            value={benefitPlan?.dateValidTo ?? ''}
            minDate={benefitPlan?.dateValidFrom ?? new Date()}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <NumberInput
            min={0}
            displayZero
            module="benefitPlan"
            label="benefitPlan.maxBeneficiaries"
            onChange={(v) => {
              this.updateAttribute('maxBeneficiaries', v === '' ? null : v);
            }}
            value={benefitPlan?.maxBeneficiaries ?? ''}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <TextInput
            module="benefitPlan"
            label="benefitPlan.institution"
            onChange={(v) => this.updateAttribute('institution', v)}
            value={benefitPlan?.institution ?? ''}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <BenefitPlanTypePicker
            label="beneficiary.benefitPlanTypePicker"
            required
            withNull={false}
            readOnly={readOnly}
            onChange={(v) => this.updateAttribute('type', v)}
            value={!!benefitPlan?.type && benefitPlan.type}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <TextAreaInput
            module="benefitPlan"
            label="benefitPlan.description"
            inputProps={{ maxLength: DESCRIPTION_MAX_LENGTH }}
            value={benefitPlan?.description}
            onChange={(v) => this.updateAttribute('description', v)}
          />
        </Grid>
        {rights.includes(RIGHT_SCHEMA_UPDATE) && (
        <Grid item xs={3} className={classes.item}>
          <ValidatedTextAreaInput
            module="benefitPlan"
            label="benefitPlan.schema"
            onChange={(v) => this.updateAttribute('beneficiaryDataSchema', v)}
            value={benefitPlan?.beneficiaryDataSchema}
            codeTakenLabel="benefitPlan.validation.benefitPlan.invalidSchema"
            itemQueryIdentifier="bfSchema"
            action={benefitPlanSchemaValidationCheck}
            clearAction={benefitPlanSchemaValidationClear}
            setValidAction={benefitPlanSchemaSetValid}
            shouldValidate={() => true}
            isValid={isBenefitPlanSchemaValid}
            isValidating={isBenefitPlanSchemaValidating}
            validationError={benefitPlanSchemaValidationError}
          />
        </Grid>
        )}
      </Grid>
    );
  }
}

const mapStateToProps = (store) => ({
  isBenefitPlanCodeValid: store.benefitPlan.validationFields?.benefitPlanCode?.isValid,
  isBenefitPlanCodeValidating: store.benefitPlan.validationFields?.benefitPlanCode?.isValidating,
  benefitPlanCodeValidationError: store.benefitPlan.validationFields?.benefitPlanCode?.validationError,
  savedBenefitPlanCode: store.benefitPlan?.benefitPlan?.code,
  isBenefitPlanNameValid: store.benefitPlan.validationFields?.benefitPlanName?.isValid,
  isBenefitPlanNameValidating: store.benefitPlan.validationFields?.benefitPlanName?.isValidating,
  benefitPlanNameValidationError: store.benefitPlan.validationFields?.benefitPlanName?.validationError,
  savedBenefitPlanName: store.benefitPlan?.benefitPlan?.name,
  isBenefitPlanSchemaValid: store.benefitPlan.validationFields?.benefitPlanSchema?.isValid,
  isBenefitPlanSchemaValidating: store.benefitPlan.validationFields?.benefitPlanSchema?.isValidating,
  benefitPlanSchemaValidationError: store.benefitPlan.validationFields?.benefitPlanSchema?.validationError,
  benefitPlanSchemaValidationErrorMessage:
    store.benefitPlan.validationFields?.benefitPlanSchema?.validationErrorMessage,
});

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(
  connect(mapStateToProps)(BenefitPlanHeadPanel),
))));
