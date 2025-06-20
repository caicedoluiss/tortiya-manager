using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using TortiYaManager.Application.Auth;
using TortiYaManager.Core.Auth;
using TortiYaManager.Infrastructure.Auth;

namespace TortiYaManager.WebAPI.Auth;

public sealed class AuthManagerService(
    RoleManager<AppRole> roleManager,
    UserManager<AppUser> userManager,
    IEmailValidator emailValidator,
    IOptions<JwtSettings> jwtSettingsOptions,
    JsonWebTokenHandler jwtHandler) : IAuthManagerService
{
    public async Task<(string field, string error)?> RegisterAsync(IAppUser user, string password, AppUserRole role)
    {
        var validation = await Validate();
        if (validation is not null) return validation;

        AppUser userToRegister = new(user.FirstName.Trim(), user.LastName.Trim(), user.Email!.Trim().ToLowerInvariant())
        {
            Id = Guid.NewGuid()
        };

        string userRole = role.ToString();
        if (!await roleManager.RoleExistsAsync(userRole))
        {
            var createRoleResult = await roleManager.CreateAsync(new() { Id = Guid.NewGuid(), Name = userRole });
            if (!createRoleResult.Succeeded) throw new ApplicationException($"User role '{userRole}' could not be created. {string.Join(", ", createRoleResult.Errors.Select(e => e.Code))}");
        }

        var createUserResult = await userManager.CreateAsync(userToRegister, password);
        if (!createUserResult.Succeeded) throw new ApplicationException($"User could not be registered. {string.Join(", ", createUserResult.Errors.Select(e => e.Code))}");

        var addToRoleResult = await userManager.AddToRoleAsync(userToRegister, userRole);
        if (!addToRoleResult.Succeeded)
        {
            await userManager.DeleteAsync(userToRegister);
            throw new ApplicationException($"User could not be associated to role. Create operation rolled back. {string.Join(", ", addToRoleResult.Errors.Select(e => e.Code))}");
        }

        return null;

        async Task<(string, string)?> Validate()
        {
            if (!Enum.IsDefined<AppUserRole>(role)) return ("role", "Invalid value.");
            if (string.IsNullOrEmpty(user.FirstName?.Trim())) return ("firstName", "Required value.");
            if (string.IsNullOrEmpty(user.LastName?.Trim())) return ("lastName", "Required value.");
            if (!emailValidator.IsValid(user.Email)) return ("email", "Invalid value.");
            if ((await userManager.FindByEmailAsync(user.Email!)) is not null) return ("email", "Value must be unique.");

            foreach (IPasswordValidator<AppUser> passwordValidator in userManager.PasswordValidators)
            {
                var result = await passwordValidator.ValidateAsync(userManager, new(user.FirstName, user.LastName, user.Email!), password);
                if (!result.Succeeded) return ("password", "Invalid value.");
            }

            return null;
        }
    }

    public async Task<string?> LoginAsync(string email, string password)
    {
        bool isEmail = emailValidator.IsValid(email);
        if (!isEmail) return null;
        var user = await userManager.FindByNameAsync(email.Trim());
        if (user is null || !await userManager.CheckPasswordAsync(user, password)) return null;

        // Create Identity
        var authClaims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.Typ, JwtConstants.TokenType),
            new(JwtRegisteredClaimNames.Iss, jwtSettingsOptions.Value.Issuer),
            new(JwtRegisteredClaimNames.Aud, jwtSettingsOptions.Value.Audience),
        };

        var claimsIdentity = new ClaimsIdentity(authClaims, JwtBearerDefaults.AuthenticationScheme);

        // Create JWT Token
        var now = DateTime.UtcNow;
        var tokenDescription = new SecurityTokenDescriptor
        {
            Subject = claimsIdentity,
            Issuer = jwtSettingsOptions.Value.Issuer,
            Audience = jwtSettingsOptions.Value.Audience,
            TokenType = JwtConstants.TokenType,
            IssuedAt = now,
            NotBefore = now,
            Expires = now.AddMinutes(jwtSettingsOptions.Value.TtlMinutes),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSettingsOptions.Value.Secret)),
                SecurityAlgorithms.HmacSha256Signature),
            CompressionAlgorithm = CompressionAlgorithms.Deflate,
        };

        string token = jwtHandler.CreateToken(tokenDescription);

        return token;
    }
}