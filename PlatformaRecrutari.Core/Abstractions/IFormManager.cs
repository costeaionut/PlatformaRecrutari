using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.FormQuestions;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Inputed_Options;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Core.Abstractions
{
    public interface IFormManager
    {
        Form getFormById(int formId);
        Task<Form> createForm(Form newForm);
        Task<BaseQuestion> addSimpleQuestionToForm(BaseQuestion newQuestion);
        Task<GridQuestion> addGridQuestionToForm(GridQuestion newQuestion);
        Task<InputsOption> addOptionsToQuestion(InputsOption inputsOption);
        Form getFormBySessionId(int sessionId);
        List<BaseQuestion> getFormsBaseQuestion(int formId);
        List<GridQuestion> getFormsGridQuestion(int formId);
        List<string> getColumnsForGridQuestion(int questionId);
        List<string> getRowsForGridQuestion(int questionId);
        List<string> getOptionsForBaseQuestion(int questionId);
        void updateBaseQuestion(BaseQuestion updatedQuestion);
        void updateGridQuestion(GridQuestion updatedGridQuestion);
        public Task updateQuestionOptionsAsync(int questionId, List<InputsOption> updatedInputs);
        void updateForm(Form updatedForm);
        void deleteBaseQuestion(int questionId);
        void deleteGridQuestion(int questionId);
    }
}
