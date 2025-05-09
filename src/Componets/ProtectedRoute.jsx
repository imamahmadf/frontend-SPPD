import React from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "./Loading";
import {
  selectIsAuthenticated,
  userRedux,
  selectRole,
} from "../Redux/Reducers/auth";

function ProtectedRoute({ component: Component, roleRoute, ...rest }) {
  const history = useHistory();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector((state) => state.auth.loading);
  const user = useSelector(userRedux);
  const roles = useSelector(selectRole); // This returns the array of role objects

  // Show loading while checking auth state
  if (loading || (isAuthenticated && !roles)) {
    return <Loading />;
  }

  return (
    <Route
      {...rest}
      render={(props) => {
        // Check authentication
        if (!isAuthenticated) {
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location },
              }}
            />
          );
        }

        // Check authorization (roles) if roleRoute is provided
        if (roleRoute) {
          // Extract just the roleIds from the nested structure
          const userRoleIds = roles.map((roleObj) => roleObj.roleId);

          // Check if any of the user's roles match the required roles
          const hasRequiredRole = roleRoute.some((requiredRole) =>
            userRoleIds.includes(requiredRole)
          );

          if (!hasRequiredRole) {
            // You can redirect to unauthorized page or back to home
            return <Redirect to="/" />;
          }
        }

        // All checks passed - render component
        return <Component {...props} />;
      }}
    />
  );
}

export default ProtectedRoute;
