const AppClaimsNames = {
    userId: "sub",
    expiration: "exp",
    notValidBefore: "nbf",
};

type JwtClaims = {
    [AppClaimsNames.userId]: string;
    [AppClaimsNames.expiration]: number;
    [AppClaimsNames.notValidBefore]: number;
};

export { AppClaimsNames };
export type { JwtClaims };
