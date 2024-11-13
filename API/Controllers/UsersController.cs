using System;
using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Authorize]
public class UsersController (IUserRepository userRepository, IMapper mapper) : BaseApiController
{
    // private readonly DataContext _context;

    // public UsersController(DataContext context){
    //     _context = context;
    // }
 
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDTO>>> GetUsers(){

        var users = await userRepository.GetMembersAsync();

        return Ok(users);
    }


    [HttpGet("{username}")]
    public async Task<ActionResult<MemberDTO>> GetUser(string username){

        var user = await userRepository.GetMemberAsync(username);

        if(user==null) return NotFound();

        return user;
    }

    [HttpPut]
    public async Task<ActionResult> UpdateUser(MemberUpdateDTO memberUpdateDTO){

        var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if(username==null) return BadRequest("No username found in token");

        var user = await userRepository.GetUserByUsernameAsync(username);
        if (user==null) return BadRequest("Could not find user");

        mapper.Map(memberUpdateDTO, user);

        if(await userRepository.SaveAllAsync()) return NoContent();

        return BadRequest("Failed to update the user");
    }

}
