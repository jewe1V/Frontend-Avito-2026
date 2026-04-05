import { useAdEditForm } from '../model/useAdEditForm';
import { AdEditView } from './AdEditView';

export const AdEditPage = () => {
  const form = useAdEditForm();

  return (
    <AdEditView
      formData={form.formData}
      setFormData={form.setFormData}
      errors={form.errors}
      isLoading={form.isLoading}
      isSaving={form.isSaving}
      toast={form.toast}
      setToast={form.setToast}
      onFieldChange={form.handleChange}
      onClear={form.handleClear}
      getParamFields={form.getParamFields}
      getParamLabel={form.getParamLabel}
      getParamInputType={form.getParamInputType}
      getParamOptions={form.getParamOptions}
      onSave={form.handleSave}
    />
  );
};

