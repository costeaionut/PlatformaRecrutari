using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.FormQuestions;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Inputed_Options;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Core.Abstractions
{
    public interface IFormManager
    {
        Task<Form> createForm(Form newForm);
        Task<BaseQuestion> addSimpleQuestionToForm(BaseQuestion newQuestion);
        Task<GridQuestion> addGridQuestionToForm(GridQuestion newQuestion);
        Task<InputsOption> addOptionsToQuestion(InputsOption inputsOption);
    }
}
