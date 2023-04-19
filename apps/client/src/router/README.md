## Router Configuration

Every routes should be put in the `routes.ts` file.

The routing will happen in `App.tsx`, there, the `browserRouter.tsx` will be
imported.

Inisde `routeGuard.tsx`, Wrapper component is used to check if the user is logged in. If the user visits a private route without being logged in, they will be redirected to the login page.
