export function composeValidators(...validators: FormValidator[]): FormValidator {
    return (values) => Object.assign({}, ...validators.map((validator) => validator(values)));
}