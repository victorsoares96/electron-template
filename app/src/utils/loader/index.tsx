import Loading from '@src/components/Loading';
import { loader as loaderDefaultOptions } from '@src/config/index.old';

import asyncComponentLoader from './loader';
import type { AnyProps, LoadComponent, LoaderDefaultOptions } from './types';

const configuredAsyncComponentLoader = (
  loadComponent: LoadComponent,
  additionalProps: AnyProps = {},
  loaderOptions: LoaderDefaultOptions = loaderDefaultOptions,
  FallbackWaiting = Loading,
) =>
  asyncComponentLoader(
    loadComponent,
    additionalProps,
    loaderOptions,
    FallbackWaiting,
  );

export { loaderDefaultOptions };
export default configuredAsyncComponentLoader;
