using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.FormQuestions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Dto.Sessions.FormQuesitons
{
    public class ShortQuestionDto : BaseQuestionDto
    {
        public static explicit operator ShortQuestionDto(BaseQuestion v)
        {
            var ShortQuestionDto = new ShortQuestionDto();
            ShortQuestionDto.Id = v.Id;
            ShortQuestionDto.Position = v.Position;
            ShortQuestionDto.Question = v.Question;
            ShortQuestionDto.Type = v.Type;
            ShortQuestionDto.Required = v.Required;
            return ShortQuestionDto;
        }
    }
}
