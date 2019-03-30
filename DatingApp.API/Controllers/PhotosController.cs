using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{
    [Route("api/users/{userId}/photos")]
    [ApiController]
    [Authorize]
    public class PhotosController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;

        private Cloudinary _cloudinary;

        public PhotosController(IDatingRepository repo, IMapper mapper, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _cloudinaryConfig = cloudinaryConfig;
            _mapper = mapper;
            _repo = repo;


            Account account = new Account(
                
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret

            );

            _cloudinary = new Cloudinary(account);
        }

      [HttpGet("{id}",Name = "GetPhoto")] // not understood.
        public async Task<IActionResult> GetPhoto(int id) {

            var photoFromRepo = await _repo.Getuser(id);

              var photo = _mapper.Map<PhotoForReturnDto>(photoFromRepo);
            return Ok(photo);
        }


         [HttpPost]
         public async Task<IActionResult> AddPhotoForUser(int userId,
               [FromForm]PhotoForCreationDto photoForCreationDto){

        

              if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                 return Unauthorized();

             var userForUpdate = await _repo.Getuser(userId);

             var file = photoForCreationDto.File;

             var uploadResult = new ImageUploadResult();

             if(file.Length > 0){

                 using(var stream = file.OpenReadStream()){

                     var uploadParam = new ImageUploadParams(){
                         File = new FileDescription(file.Name,stream),
                         Transformation = new Transformation().Width(500).Height(500).
                         Crop("fill").Gravity("face")
                     };
                     
                uploadResult =  _cloudinary.Upload(uploadParam);
                 }   
             }
                 photoForCreationDto.Url = uploadResult.Uri.ToString();
                 photoForCreationDto.PubicId = uploadResult.PublicId;


                var photo = _mapper.Map<Photo>(photoForCreationDto);

                if(!userForUpdate.Photos.Any(x=>x.IsMain))
                 photo.IsMain =true;
                                
                 userForUpdate.Photos.Add(photo);

                 if(await _repo.SaveAll()){
                     
                     var photoToReturn = _mapper.Map<PhotoForReturnDto>(photo);
                     
                     return CreatedAtRoute("GetPhoto",new { id = photo.Id },photoToReturn);
                 }

                 return BadRequest("Could not Upload photo");
         }


        [HttpPost("{id}/setMain")]
         public  async Task<IActionResult> SetMainPhoto(int userId,int id){

           if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                 return Unauthorized();

            var user = await _repo.Getuser(userId);

            if(!user.Photos.Any(x=>x.Id == id))
               return Unauthorized();

            
            var photoFromRepo = await _repo.GetPhoto(id);

             if(photoFromRepo.IsMain)
             return BadRequest("This is already a main photo");

             var currentPhoto = await _repo.GetMainPhtotoForUser(userId);
              currentPhoto.IsMain = false;

              photoFromRepo.IsMain = true;

             if(await _repo.SaveAll())
              return Ok();

             return BadRequest("Cold not set photo to main.");

         }
        
        [HttpDelete("{id}")]
         public  async Task<IActionResult> DeletePhoto(int userId,int id){

             if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

                var user = await _repo.Getuser(userId);  

                if(!user.Photos.Any(x=>x.Id ==id))
                return Unauthorized();

                var photoFromRepo = await _repo.GetPhoto(id);

                if(photoFromRepo.IsMain)
                return BadRequest("You cannot delete your main photo");
            
                 
                 if(photoFromRepo.PubicId !=null){

                 var deletionParams = new DeletionParams(photoFromRepo.PubicId);

                var deletionResult = _cloudinary.Destroy(deletionParams);

                if(deletionResult.Result == "ok")
                 _repo.Delete(photoFromRepo);

                 }

                if(photoFromRepo.PubicId ==null)
                _repo.Delete(photoFromRepo); 

                if(await _repo.SaveAll())
                return Ok();

                 return BadRequest("Faild to delete the photo");

         }

    }
}