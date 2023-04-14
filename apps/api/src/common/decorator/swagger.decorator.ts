import { applyDecorators } from '@nestjs/common';

import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiBodyOptions,
  ApiConsumes,
  ApiCookieAuth,
  ApiExcludeEndpoint,
  ApiExtension,
  ApiExtraModels,
  ApiHeader,
  ApiHeaderOptions,
  ApiOAuth2,
  ApiOperation,
  ApiOperationOptions,
  ApiParam,
  ApiParamOptions,
  ApiProduces,
  ApiQuery,
  ApiQueryOptions,
  ApiResponse,
  ApiResponseOptions,
  ApiTags,
} from '@nestjs/swagger';

interface SwaggerOptions {
  basicAuth?: { name: string };
  bearerAuth?: { name: string };
  body?: ApiBodyOptions;
  consumes?: { mimeTypes: string[] };
  cookieAuth?: { name: string };
  excludeEndpoint?: { disable: boolean };
  extension?: { extensionKey: string; extensionProperties: any };
  extraModels?: any[];
  header?: ApiHeaderOptions;
  headers?: ApiHeaderOptions[];
  oAuth2?: { scopes: string[]; name?: string };
  operation?: ApiOperationOptions;
  /** @see use `params` for multiple values. */
  param?: ApiParamOptions;
  params?: ApiParamOptions[];
  produces?: { mimeTypes: string[] };
  /** @see use `queries` for multiple values. */
  query?: ApiQueryOptions;
  queries?: ApiQueryOptions[];
  /** @see use `responses` for multiple values. */
  response?: ApiResponseOptions;
  responses?: ApiResponseOptions[];
  tags?: string[];
}

export function SwaggerMethods(args: SwaggerOptions) {
  const decorators = [
    args.basicAuth && ApiBasicAuth(args.basicAuth.name),
    args.bearerAuth && ApiBearerAuth(args.bearerAuth.name),
    args.body && ApiBody(args.body),
    args.consumes && ApiConsumes(...args.consumes.mimeTypes),
    args.cookieAuth && ApiCookieAuth(args.cookieAuth.name),
    args.excludeEndpoint && ApiExcludeEndpoint(args.excludeEndpoint.disable),
    args.extension &&
      ApiExtension(
        args.extension.extensionKey,
        args.extension.extensionProperties,
      ),
    args.extraModels && ApiExtraModels(...args.extraModels),
    args.header && ApiHeader(args.header),
    args.oAuth2 && ApiOAuth2(args.oAuth2.scopes, args.oAuth2.name),
    args.operation && ApiOperation(args.operation),
    args.param && ApiParam(args.param),
    args.params && args.params.map((param) => ApiParam(param)),
    args.produces && ApiProduces(...args.produces.mimeTypes),
    args.query && ApiQuery(args.query),
    args.queries && args.queries.map((query) => ApiQuery(query)),
    args.response && ApiResponse(args.response),
    args.responses && args.responses.map((response) => ApiResponse(response)),
    args.tags && ApiTags(...args.tags),
  ];

  return applyDecorators(
    ...decorators
      .filter((decorator) => decorator !== undefined)
      .flatMap((d) => d),
  );
}
