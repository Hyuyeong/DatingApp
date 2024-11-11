using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDTO
{
    // [Required]
    // [MaxLength(100)]

    public required string Username { get; set; }
    public required string Password { get; set; }

    public static implicit operator string(RegisterDTO v)
    {
        throw new NotImplementedException();
    }
}
