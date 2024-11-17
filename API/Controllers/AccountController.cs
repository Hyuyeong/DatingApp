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

namespace API.Controllers;

public class AccountController(DataContext context, ITokenService tokenService, IMapper mapper) :BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult<UserDTO>> Resister(RegisterDTO registerDTO)
    {

        if (await UserExists(registerDTO.Username))
        {
         return BadRequest("Username is taken");   
        }

        using var hmac = new HMACSHA512();
        var user =mapper.Map<AppUser>(registerDTO);

        user.UserName = registerDTO.Username.ToLower();
        user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTO.Password));
        user.PasswordSalt = hmac.Key;

        // var user = new AppUser
        // {
        //     UserName = registerDTO.Username.ToLower(),
        //     PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTO.Password)),
        //     PasswordSalt = hmac.Key
        // };

        context.Users.Add(user);
        await context.SaveChangesAsync();

        return new UserDTO{
            Username = user.UserName,
            Token = tokenService.CreateToken(user),
            KnownAs = user.KnownAs
        };
           
    }

    [HttpPost("Login")]
    public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO) {
        var user = await context.Users
         .Include(p => p.Photos)
            .FirstOrDefaultAsync(x => x.UserName == loginDTO.Username.ToLower()) as AppUser;
    
        if (user == null) return Unauthorized("Invalid Username");

        using var hmac = new HMACSHA512(user.PasswordSalt);

        var ComputeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDTO.Password));

        for (int i = 0; i < ComputeHash.Length; i++)
        {
            if(ComputeHash[i] != user.PasswordHash[i]) return Unauthorized("Invaild Password");
        }

        return new UserDTO{
            Username = user.UserName,
            Token = tokenService.CreateToken(user),
            PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
            KnownAs = user.KnownAs
        };
    }  

    private async Task<bool> UserExists(string username){
        return await context.Users.AnyAsync(x => x.UserName.ToLower() == username.ToLower());
    }

}
