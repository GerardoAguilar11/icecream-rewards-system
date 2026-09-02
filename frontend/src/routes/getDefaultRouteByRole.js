function getDefaultRouteByRole(role) {
  switch (role) {
    case "ADMIN":
      return "/dashboard";

    case "EMPLOYEE":
      return "/customers";

    case "CUSTOMER":
      return "/customer";

    default:
      return "/";
  }
}

export default getDefaultRouteByRole;