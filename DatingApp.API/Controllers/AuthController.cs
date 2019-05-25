using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Data.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using AutoMapper;
using DatingApp.API.Dtos;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;

        public AuthController(IAuthRepository repo, IConfiguration config,IMapper mapper)
        {
            this._config = config;
            this._repo = repo;
            this._mapper = mapper;
        }


       [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {

            userForRegisterDto.UserName = userForRegisterDto.UserName.ToLower();

            if (await _repo.UserExist(userForRegisterDto.UserName))
                return BadRequest("User Name already Exist");
             
            var userToCreate = _mapper.Map<User>(userForRegisterDto);

            var createdUser = await _repo.Register(userToCreate, userForRegisterDto.Password);

            var userToReturn = _mapper.Map<UserForDetailsDto>(createdUser);

            return CreatedAtRoute("GetUser",new {Controller ="User",id = createdUser.Id },userToReturn);

        }

        [HttpPost("Login")]
        public async Task<IActionResult> LogIn(UserForLoginDto userForLoginDto)
        {
           
            var userFromRepo = await _repo.Login(userForLoginDto.Username.ToLower(), userForLoginDto.Password);

            if (userFromRepo == null)
                return Unauthorized();

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier,userFromRepo.Id.ToString()),
                 new Claim(ClaimTypes.Name,userFromRepo.UserName)
            };


            var key = new SymmetricSecurityKey(Encoding
                                               .UTF8.GetBytes(_config.GetSection("AppSettings:Token")
                                               .Value));


            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);


            var tokenDescriptor = new SecurityTokenDescriptor()
            {

                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };


            var user = this._mapper.Map<UserForListDto>(userFromRepo);

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Ok(new
            {
               token = tokenHandler.WriteToken(token),
              user
            });
        }       
    }
}