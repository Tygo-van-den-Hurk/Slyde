import extract from '#lib/core/components/utils/extract'; // eslint-disable-line import/no-named-as-default
import toDataURL from '#lib/core/components/utils/fetch'; // eslint-disable-line import/no-named-as-default
import transform from '#lib/core/components/utils/transform';

/** The Component utils that are exposed as the static util property. */
// eslint-disable-next-line import/no-default-export
export default Object.freeze({ extract, toDataURL, transform });

export * from '#lib/core/components/utils/extract';
export * from '#lib/core/components/utils/fetch';
export * from '#lib/core/components/utils/transform';
