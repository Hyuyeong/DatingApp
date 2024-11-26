using System;
using Microsoft.AspNetCore.Mvc;
using API.Entities;
using System.Security.Cryptography;
using System.Text;
using API.Data;
using Microsoft.EntityFrameworkCore;
using API.DTOs;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;

namespace API.Controllers;

public class AccountController(UserManager<AppUser> userManager, ITokenService tokenService, IMapper mapper) :BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult<UserDTO>> Resister(RegisterDTO registerDTO)
    {

        if (await UserExists(registerDTO.Username))
        {
         return BadRequest("Username is taken");   
        }
        var user =mapper.Map<AppUser>(registerDTO);

        user.UserName = registerDTO.Username.ToLower();
     

        // var user = new AppUser
        // {
        //     UserName = registerDTO.Username.ToLower(),
        //     PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTO.Password)),
        //     PasswordSalt = hmac.Key
        // };

         var result = await userManager.CreateAsync(user, registerDTO.Password);

        if (!result.Succeeded) return BadRequest(result.Errors);

        return new UserDTO{
            Username = user.UserName,
            Token = await tokenService.CreateToken(user),
            KnownAs = user.KnownAs,
            Gender  =user.Gender
        };
           
    }

    [HttpPost("Login")]
    public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO) {
        var user = await userManager.Users
         .Include(p => p.Photos)
            .FirstOrDefaultAsync(x => x.NormalizedUserName == loginDTO.Username.ToUpper()) as AppUser;
    
        if (user == null || user.UserName == null) return Unauthorized("Invalid Username");

        var result = await userManager.CheckPasswordAsync(user, loginDTO.Password);

        if (!result) return Unauthorized();

        return new UserDTO{
            Username = user.UserName,
            Token = await tokenService.CreateToken(user),
            PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
            KnownAs = user.KnownAs,
            Gender  =user.Gender
        };
    }  

    private async Task<bool> UserExists(string username){
        return await userManager.Users.AnyAsync(x => x.NormalizedUserName == username.ToUpper());
    }

}
