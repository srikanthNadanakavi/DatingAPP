using System;
using Microsoft.AspNetCore.Http;

namespace DatingApp.API.Dtos
{
    public class PhotoForCreationDto
    {
        public string Url { get; set; }
        public IFormFile File { get; set; }

        public string Description { get; set; }

        public DateTime DateTime { get; set; }

        public string PubicId { get; set; }
        public PhotoForCreationDto() {

            DateTime = DateTime.Now;
        }

    }
}