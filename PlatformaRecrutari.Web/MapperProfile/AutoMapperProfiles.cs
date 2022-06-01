using AutoMapper;
using PlatformaRecrutari.Core.BusinessObjects;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.FormQuestions;
using PlatformaRecrutari.Dto.Sessions;
using PlatformaRecrutari.Dto.Sessions.FormQuesitons;
using PlatformaRecrutari.Dto.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DAW.Web.MapperProfiles
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<UserForRegistrationDto, User>()
                .ForMember(u => u.UserName, opt => opt.MapFrom(f => f.Email))
                .ReverseMap();

            CreateMap<RecruitmentSessionDto, RecruitmentSession>()
                .ReverseMap();

            CreateMap<FormDto, Form>()
                .ReverseMap();

            CreateMap<BaseQuestion, ShortQuestionDto>()
                .ReverseMap();

            CreateMap<BaseQuestion, MultipleQuestionDto>()
                .ReverseMap();

            CreateMap<BaseQuestion, SelectBoxesQuestionDto>()
                .ReverseMap();

            CreateMap<GridQuestion, GridMultipleQuestionDto>()
                .ReverseMap();

            CreateMap<GridQuestion, GridSelectBoxesQuestionDto>()
                .ReverseMap();
        }
    }
}