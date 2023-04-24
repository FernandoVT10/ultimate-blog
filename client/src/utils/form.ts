// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const appendArrayToFormData = (key: string, array: any[], formData: FormData): void => {
  array.forEach(item => formData.append(key, item));
};
