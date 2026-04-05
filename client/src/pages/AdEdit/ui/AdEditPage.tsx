import { useAdEditForm } from '../model';
import { AdEditView } from './AdEditView';
import {useEffect} from 'react';

export const AdEditPage = () => {
  const form = useAdEditForm();
  useEffect(() => {
    document.title = "Редактирование объявление";
  }, []);
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

